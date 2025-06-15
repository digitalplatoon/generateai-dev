
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConversations } from '@/hooks/useConversations';
import { useAISettings } from '@/hooks/useAISettings';
import { useAuditLog } from '@/hooks/useAuditLog';
import { useToast } from '@/hooks/use-toast';
import { ContentFilterService } from '@/services/contentFilter';
import { supabase } from '@/integrations/supabase/client';
import { usePresenceStatus } from './RealTimePresence';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import StreamingMessage from './StreamingMessage';
import ChatInput from './ChatInput';
import EmptyChatState from './EmptyChatState';

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
      <CardHeader>
        <CardTitle>
          <ChatHeader
            currentConversation={currentConversation}
            settings={settings}
            isStreaming={isStreaming}
            onExport={exportConversation}
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                onCopy={copyMessage}
              />
            ))}

            {/* Show streaming message */}
            {isStreaming && streamingContent && (
              <StreamingMessage content={streamingContent} />
            )}
            
            {messages.length === 0 && !isStreaming && <EmptyChatState />}
            
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        
        <ChatInput
          input={input}
          isLoading={isLoading}
          isStreaming={isStreaming}
          settings={settings}
          onInputChange={handleInputChange}
          onSendMessage={handleSendMessage}
          onStopStreaming={stopStreaming}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedChatInterface;
