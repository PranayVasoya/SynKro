import { ChatMessage as ChatMessageType } from '@/interfaces/chatbot';
import { clsx } from 'clsx';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isBot = message.sender === 'bot';

  // Use clsx to conditionally apply Tailwind classes
  const bubbleClasses = clsx(
    'max-w-xs md:max-w-md rounded-lg px-4 py-2 my-1 break-words',
    {
      'bg-blue-600 text-white rounded-br-none': !isBot,
      'bg-gray-200 text-gray-800 rounded-bl-none': isBot,
    }
  );

  const containerClasses = clsx('flex w-full my-2', {
    'justify-end': !isBot,
    'justify-start': isBot,
  });

  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};