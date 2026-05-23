import { useState } from 'react';
import Header from '@/components/Header';
import { useChatbot } from '@/hooks/useChatBot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Chat() {
  const { messages, sendMessage, status } = useChatbot();
  const [input, setInput] = useState('');
  const isLoading = status !== 'ready';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 pb-2">
      <Header title="DeepSeek Chat" showBackBtn={true} />
      <ScrollArea className="flex-1 border rounded-lg p-4 mb-4 bg-background">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Start a conversation with DeepSeek...
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {m.parts.map((part, index) =>
                    part.type === 'text' ? (
                      <span key={index}>{part.text}</span>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
