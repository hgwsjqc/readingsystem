import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport, type UIMessage } from 'ai';

function toBackendMessages(messages: UIMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join(''),
  }));
}

export const useChatbot = () => {
  return useChat({
    transport: new TextStreamChatTransport({
      api: 'http://localhost:3000/api/ai/chat',
      prepareSendMessagesRequest: ({ id, messages, body }) => ({
        body: {
          ...(body ?? {}),
          id,
          messages: toBackendMessages(messages),
        },
      }),
    }),
    onError: (err) => {
      console.error('Chat Error:', err);
    },
  });
};
