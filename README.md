# Real-Time Chat Application

LIVE DEMO: https://whimsical-malasada-add6e3.netlify.app/ 

A sophisticated real-time chat application built with React, TypeScript, and Supabase. Features multiple chat rooms, real-time messaging, user authentication, and a modern responsive design.

## Features

### Core Functionality
- **Real-Time Messaging**: Instant message delivery using Supabase Realtime
- **Multiple Chat Rooms**: Create and join different chat rooms
- **User Authentication**: Unique username system with collision detection
- **Online User Tracking**: See who's currently active in each room
- **Message Formatting**: Support for bold, italic, code, and automatic link detection
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Advanced Features
- **Auto-Scrolling**: Smooth message scrolling with new message indicators
- **Timestamps**: Relative timestamps showing when messages were sent
- **Message History**: Persistent message storage and retrieval
- **Room Management**: Create rooms with names and descriptions
- **User Presence**: Real-time online/offline status
- **Error Handling**: Comprehensive error management and user feedback

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Real-Time**: WebSocket-like functionality via Supabase Realtime

## Database Schema

### Tables

#### `rooms`
- `id` (uuid, primary key)
- `name` (text, unique)
- `description` (text, optional)
- `created_by` (text)
- `created_at` (timestamp)

#### `messages`
- `id` (uuid, primary key)
- `room_id` (uuid, foreign key)
- `user_id` (uuid)
- `username` (text)
- `content` (text)
- `created_at` (timestamp)

#### `active_users`
- `id` (uuid, primary key)
- `username` (text, unique)
- `room_id` (uuid, optional)
- `last_seen` (timestamp)
- `created_at` (timestamp)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd chat-application
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to find your project URL and anon key
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:

\`\`\`env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4. Set Up Database

Run the following SQL commands in your Supabase SQL editor:

\`\`\`sql
-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  username text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create active_users table
CREATE TABLE IF NOT EXISTS active_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all operations on messages" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all operations on active_users" ON active_users FOR ALL USING (true);

-- Create some default rooms
INSERT INTO rooms (name, description, created_by) VALUES
('General', 'General discussion for everyone', 'System'),
('Tech Talk', 'Discuss technology and programming', 'System'),
('Random', 'Off-topic conversations and fun', 'System');
\`\`\`

### 5. Run the Application

\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:5173`

## Usage Guide

### Getting Started
1. **Choose Username**: Enter a unique username (2-30 characters)
2. **Select Room**: Choose from available chat rooms or create a new one
3. **Start Chatting**: Send messages and see real-time responses from other users

### Creating Rooms
1. Click the "+" button in the room list
2. Enter a room name (required) and optional description
3. Click "Create Room" to make it available to all users

### Message Formatting
- **Bold text**: `**bold text**`
- **Italic text**: `*italic text*`
- **Code**: `` `code snippet` ``
- **Links**: URLs are automatically converted to clickable links

### Keyboard Shortcuts
- `Enter`: Send message
- `Shift + Enter`: New line in message

## Project Structure

\`\`\`
src/
├── components/          # React components
│   ├── ChatRoom.tsx    # Main chat interface
│   ├── CreateRoomModal.tsx # Room creation modal
│   ├── LoginForm.tsx   # Username authentication
│   ├── MessageInput.tsx # Message composition
│   ├── MessageList.tsx # Message display
│   ├── RoomList.tsx    # Room selection sidebar
│   └── UserList.tsx    # Online users list
├── hooks/
│   └── useChat.ts      # Main chat logic and state management
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── types/
│   └── chat.ts         # TypeScript type definitions
├── utils/
│   └── dateUtils.ts    # Date formatting utilities
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
\`\`\`

## Security Features

- **Input Validation**: All user inputs are validated and sanitized
- **XSS Protection**: Messages are safely rendered with HTML sanitization
- **Rate Limiting**: Built-in Supabase rate limiting
- **Username Uniqueness**: Prevents username conflicts and impersonation
- **SQL Injection Protection**: Parameterized queries via Supabase client

## Performance Optimizations

- **Real-Time Subscriptions**: Efficient WebSocket connections
- **Message Pagination**: Limits message history to prevent memory issues
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Auto-Cleanup**: Inactive users are automatically removed
- **Responsive Images**: Optimized loading for different screen sizes

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the existing GitHub issues
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

## Future Enhancements

- File upload and image sharing
- Private messaging between users
- Message reactions and emojis
- Advanced user roles and permissions
- Message search functionality
- Voice and video calling integration
- Mobile app version
