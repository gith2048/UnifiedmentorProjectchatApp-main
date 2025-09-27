export interface User {
  id: string;
  username: string;
  room_id?: string;
  last_seen: string;
  created_at: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  message_count?: number;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

export interface ChatState {
  currentUser: User | null;
  currentRoom: Room | null;
  rooms: Room[];
  messages: Message[];
  onlineUsers: User[];
  isLoading: boolean;
  error: string | null;
}