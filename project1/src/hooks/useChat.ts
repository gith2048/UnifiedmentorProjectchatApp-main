import { useState, useEffect, useCallback } from 'react';
import { User, Room, Message, ChatState } from '../types/chat';

// Mock data for demo purposes
const mockRooms: Room[] = [
  {
    id: '1',
    name: 'General',
    description: 'General discussion for everyone',
    created_by: 'System',
    created_at: new Date().toISOString(),
    message_count: 0
  },
  {
    id: '2',
    name: 'Tech Talk',
    description: 'Discuss technology and programming',
    created_by: 'System',
    created_at: new Date().toISOString(),
    message_count: 0
  },
  {
    id: '3',
    name: 'Random',
    description: 'Off-topic conversations and fun',
    created_by: 'System',
    created_at: new Date().toISOString(),
    message_count: 0
  }
];

const mockMessages: Message[] = [];
const mockUsers: User[] = [];

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    currentUser: null,
    currentRoom: null,
    rooms: mockRooms,
    messages: [],
    onlineUsers: [],
    isLoading: false,
    error: null,
  });

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  // Check if username is available
  const checkUsernameAvailable = async (username: string): Promise<boolean> => {
    try {
      const existingUser = mockUsers.find(user => user.username === username.trim());
      return !existingUser;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  // Join chat with username
  const joinChat = async (username: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const trimmedUsername = username.trim();
      
      if (!trimmedUsername || trimmedUsername.length < 2) {
        setError('Username must be at least 2 characters long');
        setLoading(false);
        return false;
      }

      const isAvailable = await checkUsernameAvailable(trimmedUsername);
      if (!isAvailable) {
        setError('Username is already taken. Please choose a different one.');
        setLoading(false);
        return false;
      }

      // Create user
      const user: User = {
        id: Date.now().toString(),
        username: trimmedUsername,
        last_seen: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      mockUsers.push(user);
      setState(prev => ({ ...prev, currentUser: user }));
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error joining chat:', error);
      setError('Failed to join chat. Please try again.');
      setLoading(false);
      return false;
    }
  };

  // Create room
  const createRoom = async (name: string, description?: string): Promise<boolean> => {
    if (!state.currentUser) return false;
    
    setLoading(true);
    try {
      const room: Room = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description?.trim() || undefined,
        created_by: state.currentUser.username,
        created_at: new Date().toISOString(),
        message_count: 0
      };

      setState(prev => ({
        ...prev,
        rooms: [...prev.rooms, room]
      }));
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to create room');
      setLoading(false);
      return false;
    }
  };

  // Join room
  const joinRoom = async (room: Room) => {
    if (!state.currentUser) return;

    setState(prev => ({ ...prev, currentRoom: room }));
    
    // Update user's current room
    const userIndex = mockUsers.findIndex(u => u.id === state.currentUser?.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        room_id: room.id,
        last_seen: new Date().toISOString()
      };
    }

    // Load messages for this room
    const roomMessages = mockMessages.filter(msg => msg.room_id === room.id);
    setState(prev => ({ ...prev, messages: roomMessages }));

    // Load online users in this room
    const onlineUsers = mockUsers.filter(user => user.room_id === room.id);
    setState(prev => ({ ...prev, onlineUsers }));
  };

  // Send message
  const sendMessage = async (content: string): Promise<boolean> => {
    if (!state.currentUser || !state.currentRoom || !content.trim()) {
      return false;
    }

    try {
      const message: Message = {
        id: Date.now().toString(),
        room_id: state.currentRoom.id,
        user_id: state.currentUser.id,
        username: state.currentUser.username,
        content: content.trim(),
        created_at: new Date().toISOString()
      };

      mockMessages.push(message);
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));

      // Update user's last_seen
      const userIndex = mockUsers.findIndex(u => u.id === state.currentUser?.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          last_seen: new Date().toISOString()
        };
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
      return false;
    }
  };

  // Leave chat
  const leaveChat = async () => {
    if (state.currentUser) {
      const userIndex = mockUsers.findIndex(u => u.id === state.currentUser?.id);
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
      }
    }
    
    setState({
      currentUser: null,
      currentRoom: null,
      rooms: mockRooms,
      messages: [],
      onlineUsers: [],
      isLoading: false,
      error: null,
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't auto-leave on unmount for demo purposes
    };
  }, []);

  return {
    ...state,
    joinChat,
    createRoom,
    joinRoom,
    sendMessage,
    leaveChat,
    clearError: () => setError(null),
  };
};