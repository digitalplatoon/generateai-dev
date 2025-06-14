
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
import { 
  Send, 
  Bot, 
  User, 
  Settings, 
  Clock,
  Zap,
  Shield,
  Copy,
  Download
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokens_used?: number;
  model_used?: string;
  temperature?: number;
}

const EnhancedChatInterface = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

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

      // Simulate AI response (replace with actual AI service call)
      const aiResponse = await simulateAIResponse(userMessage, settings);
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Add AI response
      await addMessage(conversation.id, {
        role: 'assistant',
        content: aiResponse.content,
        metadata: aiResponse.metadata,
        tokens_used: aiResponse.tokens_used,
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

      // Log the interaction
      await logAction(
        'chat_completion',
        'success',
        conversation.id,
        { message: userMessage, settings },
        aiResponse,
        undefined,
        processingTime
      );

    } catch (error) {
      console.error('Error sending message:', error);
      await logAction(
        'chat_completion',
        'error',
        currentConversation?.id,
        { message: userMessage },
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (message: string, settings: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      "I understand your question about " + message.substring(0, 30) + "... Let me help you with that.",
      "That's an interesting point. Based on your input, here's what I think...",
      "I can help you with that. Let me break this down for you step by step.",
      "Great question! Here's my analysis of what you've asked..."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      content: randomResponse + " (This is a simulated response for demonstration purposes.)",
      metadata: {
        model: settings?.preferred_model || 'gpt-4o-mini',
        temperature: settings?.temperature || 0.7,
        timestamp: new Date().toISOString()
      },
      tokens_used: Math.floor(50 + Math.random() * 200)
    };
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
            <Button size="sm" variant="ghost" onClick={exportConversation}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
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
            
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-sm">
                  Ask me anything! I'm here to help with your questions and tasks.
                </p>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {settings && (
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>
                Model: {settings.preferred_model} • Temperature: {settings.temperature} • Max Tokens: {settings.max_tokens}
              </span>
              <span>
                Press Enter to send, Shift+Enter for new line
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedChatInterface;
