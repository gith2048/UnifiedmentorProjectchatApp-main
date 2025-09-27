import React from 'react';
import { useChat } from './hooks/useChat';
import { LoginForm } from './components/LoginForm';
import { RoomList } from './components/RoomList';
import { ChatRoom } from './components/ChatRoom';
import { MessageCircle, AlertCircle } from 'lucide-react';

function App() {
  const {
    currentUser,
    currentRoom,
    rooms,
    messages,
    onlineUsers,
    isLoading,
    error,
    joinChat,
    createRoom,
    joinRoom,
    sendMessage,
    leaveChat,
    clearError,
  } = useChat();

  // Show login form if no current user
  if (!currentUser) {
    return (
      <LoginForm
        onJoin={joinChat}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  const handleRoomSelect = (room: typeof rooms[0]) => {
    joinRoom(room);
  };

  const handleLeaveRoom = () => {
    // Just clear current room, don't leave chat entirely
    window.location.reload(); // Simple way to reset to room selection
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Global error display */}
      {error && (
        <div className="bg-red-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Room List */}
        <div className="w-80 flex-shrink-0">
          <RoomList
            rooms={rooms}
            currentRoom={currentRoom}
            onRoomSelect={handleRoomSelect}
            onCreateRoom={createRoom}
            isLoading={isLoading}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {currentRoom ? (
            <ChatRoom
              room={currentRoom}
              messages={messages}
              onlineUsers={onlineUsers}
              currentUsername={currentUser.username}
              onSendMessage={sendMessage}
              onLeaveRoom={handleLeaveRoom}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome to ChatApp, {currentUser.username}!
                </h2>
                <p className="text-gray-400 mb-6 max-w-md">
                  Select a chat room from the sidebar to start chatting, or create a new room to begin a conversation.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={leaveChat}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Change Username
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;