# 🎤 Karaoke MVP

A dual-market karaoke platform that works for home parties AND karaoke businesses, using YouTube as the song source.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier) - https://supabase.com
- YouTube Data API key (free quota) - https://console.cloud.google.com

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Add your credentials to `.env.local`:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_YOUTUBE_API_KEY=your_youtube_key
```

4. Set up Supabase database:
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the SQL from `supabase/migrations/001_initial_schema.sql`

5. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── search/          # YouTube search components
│   ├── queue/           # Queue management components
│   ├── player/          # Video player components
│   ├── room/            # Room management components
│   └── ui/              # shadcn/ui components
├── pages/               # Page components
├── lib/                 # Utilities and services
│   ├── supabase.ts     # Supabase client
│   └── youtube.ts       # YouTube API service
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── stores/              # Zustand state management
```

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Supabase** for backend and real-time
- **Zustand** for state management
- **React Router** for routing
- **YouTube Data API v3** for song search

## 📋 Development Phases

See `karaoke_cursor_guide.md` for the complete development guide.

### Phase 1: Project Setup ✅
- [x] Vite + React + TypeScript
- [x] Tailwind CSS configuration
- [x] shadcn/ui components
- [x] Supabase client setup
- [x] YouTube API service
- [x] Database schema

### Phase 2: Core Features (In Progress)
- [ ] Room creation and joining
- [ ] YouTube search and queue
- [ ] Video player (TV mode)
- [ ] Mobile controller

## 🎯 Features

- 🏠 **Home Parties**: Create rooms and sing with friends
- 🏢 **Business Mode**: Multi-room management for karaoke businesses
- 🎵 **YouTube Integration**: Search and play karaoke videos
- 📱 **Mobile Controller**: Control the queue from your phone
- 📺 **TV Display**: Full-screen player mode
- 🔄 **Real-time Sync**: Queue updates instantly across devices
- 📋 **Playlists**: Save and share favorite songs
- 🎤 **Vocal Removal**: Basic AI vocal removal (MVP)

## 📝 License

MIT

