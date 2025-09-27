import React, { useState } from 'react';
import { Plus, MessageSquare, Hash } from 'lucide-react';
import { Room } from '../types/chat';
import { CreateRoomModal } from './CreateRoomModal';

interface RoomListProps {
  rooms: Room[];
  currentRoom: Room | null;
  onRoomSelect: (room: Room) => void;
  onCreateRoom: (name: string, description?: string) => Promise<boolean>;
  isLoading: boolean;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  currentRoom,
  onRoomSelect,
  onCreateRoom,
  isLoading,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateRoom = async (name: string, description?: string) => {
    const success = await onCreateRoom(name, description);
    if (success) {
      setShowCreateModal(false);
    }
    return success;
  };

  return (
    <>
      <div className="h-full bg-gray-900 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Chat Rooms</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              title="Create Room"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {rooms.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No rooms available</p>
                <p className="text-xs mt-1">Create the first room!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => onRoomSelect(room)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-gray-800 ${
                      currentRoom?.id === room.id
                        ? 'bg-purple-600/20 border border-purple-500/30'
                        : 'border border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        currentRoom?.id === room.id 
                          ? 'bg-purple-500/20' 
                          : 'bg-gray-700'
                      }`}>
                        <Hash className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium truncate ${
                            currentRoom?.id === room.id
                              ? 'text-purple-300'
                              : 'text-gray-200'
                          }`}>
                            {room.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            {room.message_count !== undefined && (
                              <span className="flex items-center">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {room.message_count}
                              </span>
                            )}
                          </div>
                        </div>
                        {room.description && (
                          <p className="text-sm text-gray-400 mt-1 truncate">
                            {room.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Created by {room.created_by}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRoom}
        isLoading={isLoading}
      />
    </>
  );
};