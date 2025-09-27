import React, { useState, useRef } from 'react';
import { Send, Smile } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => Promise<boolean>;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    const success = await onSend(message);
    if (success) {
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="border-t border-gray-700 bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 resize-none min-h-[48px] max-h-[120px]"
            maxLength={1000}
            disabled={disabled || isSending}
            rows={1}
          />
          <div className="absolute right-3 top-3 text-gray-400">
            <Smile className="w-5 h-5" />
          </div>
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim() || isSending}
          className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
          title="Send message"
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      
      <div className="mt-2 text-xs text-gray-400 flex justify-between">
        <span>
          Formatting: **bold**, *italic*, `code`, links auto-detected
        </span>
        <span>
          {message.length}/1000
        </span>
      </div>
    </div>
  );
};