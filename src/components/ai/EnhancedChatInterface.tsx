
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useConversations } from '@/hooks/useConversations';
import { useAISettings } from '@/hooks/useAISettings';
import { useAuditLog } from '@/hooks/useAuditLog';
import { useToast } from '@/hooks/use-toast';
import { ContentFilterService } from '@/services/contentFilter';
import { supabase } from '@/integrations/supabase/client';
import RealTimePresence, { usePresenceStatus } from './RealTimePresence';
import { 
  Send, 
  Bot, 
  User, 
  Clock,
  Zap,
  Shield,
  Copy,
  Download,
  StopCircle,
  AlertTriangle,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokens_used?: number;
  model_used?: string;
  temperature?: number;
  isStreaming?: boolean;
  created_at: string;
}

const EnhancedChatInterface = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const { 
    currentConversation, 
    messages, 
    addMessage, 
    createConversation,
    updateConversation 
  } = useConversations();
  
  const { settings } = useAISettings();
  const { logAction } = useAuditLog();
  const { updateStatus } = usePresenceStatus(currentConversation?.id || '');

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Handle typing status for real-time presence
  useEffect(() => {
    if (currentConversation?.id) {
      if (isTyping) {
        updateStatus('typing');
      } else {
        updateStatus('online');
      }
    }
  }, [isTyping, currentConversation?.id, updateStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set typing status
    if (!isTyping) {
      setIsTyping(true);
    }

    // Set timeout to stop typing status
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const stopStreaming = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsStreaming(false);
    setStreamingMessageId(null);
    setStreamingContent('');
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsTyping(false);

    // Content filtering
    const filterResult = ContentFilterService.filterContent(userMessage, true);
    if (!filterResult.allowed) {
      toast({
        title: "Content Filter",
        description: filterResult.reason || "Your message contains inappropriate content.",
        variant: "destructive"
      });
      
      // Log the blocked attempt
      await logAction(
        'content_filter_block',
        'blocked',
        currentConversation?.id,
        { message: userMessage, filter_result: filterResult }
      );
      
      return;
    }

    try {
      setIsLoading(true);
      const startTime = Date.now();

      // Create conversation if none exists
      let conversation = currentConversation;
      if (!conversation) {
        conversation = await createConversation('New Conversation');
        if (!conversation) throw new Error('Failed to create conversation');
      }

      // Add user message
      await addMessage(conversation.id, {
        role: 'user',
        content: userMessage,
        metadata: {}
      });

      // Prepare messages for AI
      const conversationMessages = [...messages, {
        role: 'user' as const,
        content: userMessage,
        created_at: new Date().toISOString()
      }];

      // Start streaming response
      setIsStreaming(true);
      setStreamingContent('');
      const controller = new AbortController();
      setAbortController(controller);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('https://zguwfogavvdsbujiakko.supabase.co/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          messages: conversationMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          settings: {
            model: settings?.preferred_model || 'gpt-4o-mini',
            temperature: settings?.temperature || 0.7,
            max_tokens: settings?.max_tokens || 1000,
            custom_instructions: settings?.custom_instructions || '',
            do_not_train: settings?.do_not_train_consent || true
          },
          conversationId: conversation.id,
          stream: true
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  
                  if (parsed.type === 'chunk' && parsed.content) {
                    fullContent += parsed.content;
                    setStreamingContent(fullContent);
                  } else if (parsed.type === 'done') {
                    fullContent = parsed.content || fullContent;
                    break;
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      }

      setIsStreaming(false);
      setStreamingContent('');
      setAbortController(null);

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Add AI response
      await addMessage(conversation.id, {
        role: 'assistant',
        content: fullContent,
        metadata: {
          model: settings?.preferred_model || 'gpt-4o-mini',
          temperature: settings?.temperature || 0.7,
          timestamp: new Date().toISOString()
        },
        tokens_used: Math.floor(fullContent.length / 4), // Rough estimation
        model_used: settings?.preferred_model || 'gpt-4o-mini',
        temperature: settings?.temperature || 0.7
      });

      // Update conversation title if it's the first exchange
      if (messages.length === 0) {
        const title = userMessage.length > 50 
          ? userMessage.substring(0, 50) + '...' 
          : userMessage;
        await updateConversation(conversation.id, { title });
      }

      // Log the successful interaction
      await logAction(
        'chat_completion',
        'success',
        conversation.id,
        { message: userMessage, settings },
        { content: fullContent },
        undefined,
        processingTime
      );

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      if (error.name === 'AbortError') {
        toast({
          title: "Cancelled",
          description: "Message cancelled by user.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }

      await logAction(
        'chat_completion',
        'error',
        currentConversation?.id,
        { message: userMessage },
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setAbortController(null);
      setStreamingContent('');
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  const exportConversation = () => {
    if (!currentConversation || messages.length === 0) return;
    
    const exportData = {
      title: currentConversation.title,
      created_at: currentConversation.created_at,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${currentConversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>{currentConversation?.title || 'New Conversation'}</span>
          <div className="flex items-center gap-2">
            {settings && (
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                T: {settings.temperature.toFixed(1)}
              </Badge>
            )}
            {currentConversation?.do_not_train && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Private
              </Badge>
            )}
            {isStreaming && (
              <Badge variant="outline" className="text-xs animate-pulse">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-1" />
                Streaming
              </Badge>
            )}
            <Button size="sm" variant="ghost" onClick={exportConversation}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        
        {/* Real-time Presence */}
        {currentConversation && (
          <RealTimePresence conversationId={currentConversation.id} />
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Bot className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className={`space-y-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                      {message.tokens_used && (
                        <>
                          <span>•</span>
                          <span>{message.tokens_used} tokens</span>
                        </>
                      )}
                      {message.model_used && (
                        <>
                          <span>•</span>
                          <span>{message.model_used}</span>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyMessage(message.content)}
                        className="h-4 w-4 p-0 ml-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Show streaming message */}
            {isStreaming && streamingContent && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm whitespace-pre-wrap">{streamingContent}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                        <div className="animate-pulse">●</div>
                        <span>AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {messages.length === 0 && !isStreaming && (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-sm">
                  Ask me anything! I'm here to help with your questions and tasks.
                </p>
                <div className="mt-4 p-3 bg-muted rounded-lg text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Enhanced Security & Collaboration</span>
                  </div>
                  <p>All messages are filtered for malicious content, and you can collaborate with your team in real-time.</p>
                </div>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="min-h-[60px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isLoading && !isStreaming) {
                    handleSendMessage();
                  }
                }
              }}
              disabled={isLoading || isStreaming}
            />
            <div className="flex flex-col gap-2">
              {isStreaming ? (
                <Button
                  onClick={stopStreaming}
                  variant="outline"
                  className="self-end"
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {settings && (
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Model: {settings.preferred_model}</span>
                <span>•</span>
                <span>T: {settings.temperature}</span>
                <span>•</span>
                <span>Max: {settings.max_tokens}</span>
                {settings.do_not_train_consent && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Private</span>
                    </div>
                  </>
                )}
              </div>
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedChatInterface;
