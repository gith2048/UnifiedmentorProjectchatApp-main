import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => Promise<boolean>;
  isLoading: boolean;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Room name is required');
      return;
    }

    if (name.trim().length < 2) {
      setError('Room name must be at least 2 characters long');
      return;
    }

    const success = await onSubmit(name, description || undefined);
    if (success) {
      setName('');
      setDescription('');
      setError('');
    } else {
      setError('Failed to create room. Please try again.');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName('');
      setDescription('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Create New Room</h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-gray-200 mb-2">
              Room Name *
            </label>
            <input
              id="roomName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter room name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              maxLength={50}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="roomDescription" className="block text-sm font-medium text-gray-200 mb-2">
              Description (optional)
            </label>
            <textarea
              id="roomDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter room description"
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 resize-none"
              maxLength={200}
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};