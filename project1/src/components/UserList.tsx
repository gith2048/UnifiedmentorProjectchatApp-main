import React from 'react';
import { Users, Circle } from 'lucide-react';
import { User } from '../types/chat';

interface UserListProps {
  users: User[];
  currentUsername: string;
}

export const UserList: React.FC<UserListProps> = ({ users, currentUsername }) => {
  return (
    <div className="w-64 bg-gray-900 border-l border-gray-700 hidden lg:block">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-white">
            Online ({users.length})
          </h3>
        </div>
      </div>
      
      <div className="p-2 overflow-y-auto">
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No users online</p>
          </div>
        ) : (
          <div className="space-y-1">
            {users.map((user) => {
              const isCurrentUser = user.username === currentUsername;
              return (
                <div
                  key={user.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    isCurrentUser ? 'bg-purple-600/20' : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <Circle className="w-3 h-3 text-green-400 fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isCurrentUser ? 'text-purple-300' : 'text-gray-200'
                    }`}>
                      {user.username}
                      {isCurrentUser && (
                        <span className="text-purple-400 ml-1">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">Online</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};