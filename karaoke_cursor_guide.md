# YouTube Karaoke System - Complete Build Guide for Cursor + Claude

## 🎯 Project Overview

Build a dual-market karaoke platform that works for home parties AND karaoke businesses, using YouTube as the song source.

---

## 📋 Prerequisites

### Required Accounts:
1. **Supabase** (free tier) - https://supabase.com
2. **YouTube Data API** (free quota) - https://console.cloud.google.com
3. **Vercel** (free tier) - https://vercel.com

### Local Setup:
- Node.js 18+ installed
- Cursor IDE installed
- Git installed

---

## 🏗️ Phase 1: Project Initialization

### Step 1: Create Project in Cursor

Open Cursor and use Claude (Cmd+K or Ctrl+K):

```
Create a new React project with the following setup:
- Use Vite for the build tool
- TypeScript enabled
- Install and configure Tailwind CSS
- Install shadcn/ui and set up the following components: button, card, input, dialog, tabs, toast
- Install these additional packages: @supabase/supabase-js, lucide-react, react-router-dom, zustand
- Create a basic folder structure: /components, /pages, /lib, /hooks, /types
- Set up environment variables for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and VITE_YOUTUBE_API_KEY
```

### Step 2: Configure Supabase

1. Go to https://supabase.com and create a new project
2. Get your project URL and anon key from Settings > API
3. Add to `.env.local`:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_YOUTUBE_API_KEY=your_youtube_key
```

### Step 3: Set Up YouTube API

In Cursor, ask Claude:

```
Help me set up YouTube Data API v3:
1. Create a service to search YouTube videos with the query format "[song name] karaoke"
2. Filter results to only show videos with "karaoke" in the title
3. Return video ID, title, thumbnail, and channel name
4. Handle API quota limits gracefully
5. Create TypeScript types for YouTube video data
```

---

## 🗄️ Phase 2: Database Schema

Ask Claude in Cursor:

```
Create Supabase database schema with SQL migrations for:

Tables needed:
1. rooms - id, name, code (6-char unique), host_user_id, created_at, is_active, type (home/business)
2. queue_items - id, room_id, video_id, video_title, video_thumbnail, added_by_user_id, added_by_name, played_at, created_at, position
3. users - id, email, display_name, created_at
4. playlists - id, user_id, name, created_at
5. playlist_songs - id, playlist_id, video_id, video_title, position

Create RLS (Row Level Security) policies for each table.
Enable real-time subscriptions for queue_items table.
```

Run the generated SQL in Supabase SQL Editor.

---

## 🎨 Phase 3: Core Features Development

### Feature 1: Room Creation & Joining

In Cursor, ask Claude:

```
Create a room management system:

1. Home page with two options: "Create Room" and "Join Room"
2. Create Room flow:
   - Generate unique 6-character room code
   - Store in Supabase
   - Navigate to room controller view
3. Join Room flow:
   - Input room code
   - Validate code exists
   - Navigate to queue view
4. Use zustand for global room state management
5. Add error handling and loading states
```

### Feature 2: YouTube Search & Queue

Ask Claude:

```
Build the song search and queue system:

1. Search component:
   - Input field for song search
   - Debounced search (500ms delay)
   - Display results in a grid with thumbnails
   - "Add to Queue" button on each result
2. Queue component:
   - Display current queue items
   - Show position, thumbnail, title, added by
   - Real-time updates using Supabase subscriptions
   - Drag-and-drop reordering (use @dnd-kit/core)
3. Add songs to Supabase queue_items table
4. Subscribe to queue changes and update UI instantly
```

### Feature 3: Player View (TV Mode)

Ask Claude:

```
Create the TV display mode for playing videos:

1. Full-screen player view:
   - Embed YouTube IFrame Player API
   - Show current song title and "up next" preview
   - Auto-play next song when current ends
   - Display room code in corner
2. Player controls:
   - Play/pause
   - Skip to next
   - Volume control
   - Key adjustment (+/- semitones using Web Audio API)
3. Connect to queue via Supabase real-time
4. Handle player state (loading, playing, ended)
5. Responsive design for TV screens (1080p/4K)
```

### Feature 4: Mobile Controller

Ask Claude:

```
Build the mobile remote control interface:

1. Controller view for room participants:
   - Search and add songs
   - View current queue
   - See now playing
   - "My Songs" filter
2. Host controls (only for room creator):
   - Skip current song
   - Remove songs from queue
   - Pause/resume
   - End session
3. QR code generation for easy room joining
4. Use react-qr-code library
```

---

## 🎯 Phase 4: Advanced Features

### Feature 5: User Authentication

Ask Claude:

```
Implement Supabase authentication:

1. Email/password signup and login
2. Google OAuth integration
3. Anonymous users (assign random display name)
4. Profile management (change display name)
5. Protected routes for saved playlists
6. Auth context with React Context API
```

### Feature 6: Playlists

Ask Claude:

```
Create playlist management:

1. Save songs to personal playlists
2. Quick-add entire playlist to queue
3. Public/private playlist toggle
4. Browse community playlists (most popular)
5. CRUD operations for playlists
```

### Feature 7: Vocal Removal (AI)

Ask Claude:

```
Integrate vocal removal using Web Audio API:

1. Use MediaElementAudioSourceNode to access YouTube audio
2. Apply band-pass filter to isolate vocals
3. Invert phase and mix with original (karaoke effect)
4. Add toggle button in player controls
5. Note: This is basic vocal removal, not perfect but works for MVP
6. Consider integrating Spleeter API later for better quality
```

---

## 🎨 Phase 5: UI Polish

### Styling & UX Improvements

Ask Claude:

```
Enhance the UI/UX:

1. Add loading skeletons for search results
2. Smooth animations with Framer Motion
3. Toast notifications for actions (song added, removed, etc.)
4. Dark mode toggle
5. Mobile-responsive design
6. Empty states (no songs in queue, no search results)
7. Error boundaries for better error handling
8. Keyboard shortcuts (space = play/pause, n = next, etc.)
```

---

## 🚀 Phase 6: Business Features

### Multi-Room Dashboard

Ask Claude:

```
Build the business admin dashboard:

1. Overview page showing all active rooms
2. Real-time room statistics:
   - Songs played
   - Active users
   - Session duration
3. Room management:
   - Create multiple rooms
   - Assign to physical locations
   - Monitor queue for each room
4. Analytics:
   - Most played songs (daily/weekly/monthly)
   - Peak usage times
   - Average session length
5. Settings:
   - Custom branding (logo, colors)
   - Song filtering (explicit content)
   - Auto-skip after X minutes
```

---

## 🧪 Phase 7: Testing & Optimization

Ask Claude:

```
Help me add testing and optimize performance:

1. Set up Vitest for unit tests
2. Test critical functions:
   - Room code generation
   - Queue operations
   - YouTube search
3. Add React Testing Library for component tests
4. Optimize YouTube API calls (caching, rate limiting)
5. Lazy load components with React.lazy
6. Optimize images (thumbnails)
7. Add error logging with Sentry (optional)
```

---

## 📦 Phase 8: Deployment

### Deploy to Vercel

Ask Claude:

```
Help me deploy to Vercel:

1. Create vercel.json configuration
2. Set up environment variables in Vercel dashboard
3. Configure build settings
4. Set up custom domain (optional)
5. Enable analytics
6. Set up preview deployments for branches
```

### Supabase Production Setup

Ask Claude:

```
Prepare Supabase for production:

1. Review and tighten RLS policies
2. Set up database backups
3. Configure email templates (auth)
4. Add rate limiting
5. Monitor usage and quotas
6. Set up database indexes for performance
```

---

## 💰 Phase 9: Monetization Setup

### Stripe Integration

Ask Claude:

```
Integrate Stripe for subscriptions:

1. Set up Stripe account and get API keys
2. Create subscription products:
   - Basic: $9.99/month
   - Pro: $19.99/month
   - Business: $49/month per room
3. Implement checkout flow
4. Handle webhooks for subscription events
5. Create billing portal for users
6. Add subscription gates to premium features
7. Store subscription status in Supabase users table
```

---

## 📱 Phase 10: PWA Setup (Optional)

Ask Claude:

```
Convert to Progressive Web App:

1. Add manifest.json with app icons
2. Implement service worker for offline support
3. Enable "Add to Home Screen"
4. Cache YouTube search results
5. Offline queue management
6. Push notifications for turn reminders
```

---

## 🐛 Debugging Tips

When you encounter issues, ask Claude:

```
Help me debug this issue: [paste error message]

Context:
- What I was trying to do
- What happened instead
- Relevant code snippet
- Browser console errors
```

---

## 📚 Key Files Structure

```
src/
├── components/
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   └── SearchResults.tsx
│   ├── queue/
│   │   ├── QueueList.tsx
│   │   └── QueueItem.tsx
│   ├── player/
│   │   ├── VideoPlayer.tsx
│   │   └── PlayerControls.tsx
│   ├── room/
│   │   ├── RoomCreate.tsx
│   │   ├── RoomJoin.tsx
│   │   └── RoomCode.tsx
│   └── ui/ (shadcn components)
├── pages/
│   ├── Home.tsx
│   ├── Room.tsx
│   ├── TVMode.tsx
│   ├── Dashboard.tsx (business)
│   └── Settings.tsx
├── lib/
│   ├── supabase.ts
│   ├── youtube.ts
│   └── utils.ts
├── hooks/
│   ├── useRoom.ts
│   ├── useQueue.ts
│   └── useAuth.ts
├── types/
│   └── index.ts
└── stores/
    └── roomStore.ts (zustand)
```

---

## 🎯 Development Workflow

### Daily Development Pattern:

1. **Morning:** Plan feature in Cursor with Claude
```
I want to build [feature]. Break it down into:
1. Components needed
2. State management approach
3. Supabase queries
4. Potential issues
```

2. **Afternoon:** Implement with Claude's help
```
Let's implement [component]:
- Use TypeScript
- Follow existing code patterns
- Add error handling
- Make it responsive
```

3. **Evening:** Test and refine
```
Review this code for:
- Performance issues
- Edge cases
- Accessibility
- Better patterns
```

---

## 🚨 Common Issues & Solutions

### Issue 1: YouTube API Quota Exceeded
**Solution:** Implement caching and rate limiting
```
Help me add Redis caching for YouTube search results
with a 1-hour TTL
```

### Issue 2: Real-time Sync Delays
**Solution:** Optimize Supabase subscriptions
```
My queue updates are slow. Help me optimize the
real-time subscription and add optimistic updates
```

### Issue 3: CORS Issues with YouTube
**Solution:** Use IFrame API correctly
```
I'm getting CORS errors with YouTube. Help me
properly implement the IFrame Player API
```

---

## 📊 Success Metrics to Track

Ask Claude to help you implement analytics:

```
Set up analytics tracking for:
1. Rooms created (daily)
2. Songs added to queue (per session)
3. Average session duration
4. User retention (7-day, 30-day)
5. Conversion rate (free to paid)
6. Most searched songs
7. Feature usage (vocal removal, playlists, etc.)

Use Vercel Analytics or Plausible for privacy-friendly tracking
```

---

## 🎓 Learning Resources

If Claude suggests something unfamiliar, ask:

```
Explain [concept] in the context of this project:
- What problem does it solve?
- How do I implement it?
- What are the alternatives?
- Show me an example in our codebase
```

---

## 🔄 Iterative Prompts for Claude

### When Starting a New Feature:
```
I want to add [feature]. Before we code:
1. What's the simplest implementation?
2. What data do we need to store?
3. What components are affected?
4. Any potential issues?
```

### When Stuck:
```
I'm stuck on [problem]. Here's what I've tried:
[list attempts]

Can you:
1. Explain why it's not working
2. Suggest 3 different approaches
3. Show me the code for the best approach
```

### When Refactoring:
```
This code works but it's messy: [paste code]

Help me refactor it to be:
- More readable
- Better performance
- Easier to test
- Follow React best practices
```

---

## ✅ MVP Checklist (Week 1-2)

- [ ] Project setup with Vite + React + TypeScript
- [ ] Supabase configuration
- [ ] YouTube API integration
- [ ] Room creation and joining
- [ ] Song search with YouTube
- [ ] Queue management with real-time sync
- [ ] Basic video player
- [ ] Mobile controller interface
- [ ] TV display mode
- [ ] QR code generation
- [ ] Deploy to Vercel
- [ ] Test with 5 friends at a party

---

## 🚀 Launch Checklist (Week 3-4)

- [ ] User authentication
- [ ] Playlist management
- [ ] Vocal removal toggle
- [ ] Host controls
- [ ] Analytics dashboard
- [ ] Error logging
- [ ] Performance optimization
- [ ] Mobile responsive
- [ ] Dark mode
- [ ] Landing page
- [ ] Stripe integration
- [ ] Beta testing with 20 users

---

## 💡 Pro Tips

1. **Use Claude's composer mode** in Cursor for complex features
2. **Ask Claude to explain trade-offs** before making architectural decisions
3. **Commit frequently** with clear messages (Claude can help write them)
4. **Test on real devices** - mobile behavior differs from desktop
5. **Start simple** - don't build everything at once
6. **Get feedback early** - test with real users after MVP

---

## 🎯 Next Steps After MVP

Once you have a working MVP, ask Claude:

```
My MVP is live with [X] users. Help me prioritize:

User feedback:
[paste feedback]

Feature requests:
[list requests]

What should I build next to maximize:
1. User retention
2. Word-of-mouth growth
3. Revenue potential
```

---

## 🤝 Getting Help

If you get stuck at any point:

1. **In Cursor:** Use Cmd+K / Ctrl+K and paste the relevant error or question
2. **Be specific:** Include error messages, code snippets, and what you've tried
3. **Ask for alternatives:** "What are 3 different ways to solve this?"
4. **Request explanations:** "Explain why this approach is better"

---

## 🎉 You're Ready!

Start with Phase 1 and work through each phase systematically. Use Claude in Cursor as your pair programmer - it will help you write code, debug issues, and make architectural decisions.

**First prompt to use in Cursor:**
```
Let's build a YouTube-based karaoke system. Start by creating
the project with Vite, React, TypeScript, and Tailwind CSS.
Set up the folder structure and install all necessary packages.
```

Good luck! 🎤🚀