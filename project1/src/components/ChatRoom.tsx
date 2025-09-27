import React from 'react';
import { LogOut, Hash, Users as UsersIcon } from 'lucide-react';
import { Room, Message, User } from '../types/chat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { UserList } from './UserList';

interface ChatRoomProps {
  room: Room;
  messages: Message[];
  onlineUsers: User[];
  currentUsername: string;
  onSendMessage: (message: string) => Promise<boolean>;
  onLeaveRoom: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  room,
  messages,
  onlineUsers,
  currentUsername,
  onSendMessage,
  onLeaveRoom,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-800">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Hash className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{room.name}</h1>
              {room.description && (
                <p className="text-sm text-gray-400">{room.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-gray-400">
              <UsersIcon className="w-4 h-4" />
              <span className="text-sm">{onlineUsers.length} online</span>
            </div>
            <button
              onClick={onLeaveRoom}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              title="Leave room"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          <MessageList messages={messages} currentUsername={currentUsername} />
          <MessageInput onSend={onSendMessage} />
        </div>

        {/* Online Users */}
        <UserList users={onlineUsers} currentUsername={currentUsername} />
      </div>
    </div>
  );
};