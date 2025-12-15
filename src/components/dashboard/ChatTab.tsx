
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { chatMessageSchema, sanitizeHtml, checkRateLimit } from '@/lib/security';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const ChatTab = () => {
  const { toast } = useToast();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    // Rate limiting check (5 messages per minute)
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the chat feature.",
        variant: "destructive"
      });
      return;
    }

    if (!checkRateLimit(`chat_${userId}`, 5, 60000)) {
      toast({
        title: "Rate Limit Exceeded",
        description: "Please wait before sending another message.",
        variant: "destructive"
      });
      return;
    }

    // Validate message
    try {
      chatMessageSchema.parse({ message: chatInput });
    } catch (err: any) {
      toast({
        title: "Invalid Message",
        description: err.errors?.[0]?.message || "Please check your message and try again.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: ChatMessage = { 
      role: 'user', 
      content: sanitizeHtml(chatInput),
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          message: chatInput,
          history: chatMessages.slice(-5).map(msg => ({ // Limit history to last 5 messages
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage: ChatMessage = { 
          role: 'assistant', 
          content: sanitizeHtml(data.message),
          timestamp: Date.now()
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: "Chat Error",
        description: "Failed to get AI response. Please try again later.",
        variant: "destructive"
      });
      
      // Remove the user message if the AI response failed
      setChatMessages(prev => prev.filter(msg => msg.timestamp !== userMessage.timestamp));
    } finally {
      setChatLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="bg-navy/80 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-96 overflow-y-auto bg-navy/50 rounded-lg p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <p className="text-light-gray text-center">Start a conversation with your AI assistant!</p>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-teal text-navy' 
                      : 'bg-white/10 text-white'
                  }`}>
                    <div className="break-words whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    <div className={`text-xs mt-1 opacity-70 ${
                      msg.role === 'user' ? 'text-navy/70' : 'text-white/70'
                    }`}>
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white px-4 py-2 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything about AI development..."
              className="flex-1 bg-navy border-white/20 text-white"
              disabled={chatLoading}
              maxLength={1000}
            />
            <Button 
              type="submit" 
              disabled={chatLoading || !chatInput.trim()}
              className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy"
            >
              Send
            </Button>
          </form>
          <p className="text-xs text-light-gray">
            Messages are limited to 1000 characters. Rate limited to 5 messages per minute.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatTab;
