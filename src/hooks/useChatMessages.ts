
import { useState, useRef, useEffect } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { useAISettings } from '@/hooks/useAISettings';
import { useAuditLog } from '@/hooks/useAuditLog';
import { useToast } from '@/hooks/use-toast';
import { ContentFilterService } from '@/services/contentFilter';
import { supabase } from '@/integrations/supabase/client';

export const useChatMessages = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
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

  const sendMessage = async (onStreamingStart: (content: string) => void, onStreamingUpdate: (content: string) => void, onStreamingEnd: () => void) => {
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
      onStreamingStart('');

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
            do_not_train: settings?.do_not_train_consent || true
          },
          conversationId: conversation.id,
          stream: true
        })
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
                    onStreamingUpdate(fullContent);
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

      onStreamingEnd();

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
      onStreamingEnd();
    }
  };

  return {
    input,
    isLoading,
    isTyping,
    currentConversation,
    messages,
    settings,
    handleInputChange,
    sendMessage
  };
};
