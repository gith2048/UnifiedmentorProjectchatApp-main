import React, { useEffect, useRef } from 'react';
import { Message } from '../types/chat';
import { formatDistanceToNow } from '../utils/dateUtils';

interface MessageListProps {
  messages: Message[];
  currentUsername: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUsername }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (content: string) => {
    // Basic text formatting
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 rounded text-sm">$1</code>') // Code
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>'
      ); // Links

    return { __html: formatted };
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-lg">No messages yet</p>
          <p className="text-sm">Be the first to say something!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isOwnMessage = message.username === currentUsername;
        const showUsername = index === 0 || messages[index - 1].username !== message.username;
        const showTimestamp = 
          index === messages.length - 1 ||
          messages[index + 1].username !== message.username ||
          new Date(messages[index + 1].created_at).getTime() - new Date(message.created_at).getTime() > 300000; // 5 minutes

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
              {showUsername && !isOwnMessage && (
                <div className="mb-1">
                  <span className="text-sm font-semibold text-purple-400">
                    {message.username}
                  </span>
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-lg shadow-sm ${
                  isOwnMessage
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={formatMessage(message.content)}
                />
              </div>
              {showTimestamp && (
                <div className={`text-xs text-gray-400 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                  {formatDistanceToNow(new Date(message.created_at))} ago
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};