# YouTube Karaoke System - Complete Development TODO

> **For Cursor AI:** This is a comprehensive build guide. Read this entire file before starting. Use the latest stable versions of all libraries.

---

## 🎯 Project Vision

Build a dual-market karaoke platform (home parties + businesses) using YouTube as the song source with real-time queue management.

---

## 📦 Tech Stack (Latest Versions - January 2025)

### Core Framework
- **React 18.3+** with **Vite 5.4+**
- **TypeScript 5.7+**
- **React Router 7+** (or TanStack Router for advanced routing)

### Styling & UI
- **Tailwind CSS 4+** (new engine)
- **shadcn/ui** (latest components)
- **Framer Motion 11+** (animations)
- **lucide-react 0.460+** (icons)

### State Management
- **Zustand 5+** (global state)
- **TanStack Query 5+** (server state, replaces React Query)

### Backend & Database
- **Supabase JS 2.48+** (database + auth + real-time)
- **Supabase SSR** (if using SSR later)

### YouTube Integration
- **YouTube IFrame Player API** (official)
- **youtube-search-api** or direct API calls

### Drag & Drop
- **@dnd-kit/core 6+** (modern, accessible DnD)

### Forms & Validation
- **React Hook Form 7+**
- **Zod 3+** (schema validation)

### Additional Tools
- **react-qr-code 2+** (QR generation)
- **sonner** (toast notifications, better than react-hot-toast)
- **date-fns 4+** (date utilities)
- **clsx** + **tailwind-merge** (className utilities)

### Testing (Post-MVP)
- **Vitest 2+** (unit tests)
- **Testing Library** (component tests)
- **Playwright 1.50+** (E2E tests)

### Deployment
- **Vercel** (hosting)
- **Vercel Analytics** (metrics)

---

## 🚀 PHASE 1: PROJECT INITIALIZATION

### ✅ Task 1.1: Create Project

**Prompt for Cursor:**
```
Create a new React project with the following exact setup:

1. Initialize with Vite 5.4+ using React + TypeScript template
2. Install and configure Tailwind CSS 4.x
3. Install shadcn/ui CLI and initialize with New York theme
4. Install these exact packages:
   - @supabase/supabase-js@latest
   - @tanstack/react-query@^5.0.0
   - zustand@^5.0.0
   - react-router-dom@^7.0.0 (or @tanstack/react-router if preferred)
   - framer-motion@^11.0.0
   - lucide-react@latest
   - react-hook-form@^7.0.0
   - zod@^3.0.0
   - @dnd-kit/core@^6.0.0
   - @dnd-kit/sortable@^8.0.0
   - react-qr-code@^2.0.0
   - sonner@latest
   - date-fns@^4.0.0
   - clsx@latest
   - tailwind-merge@latest

5. Create this folder structure:
   src/
   ├── components/
   │   ├── ui/ (shadcn components)
   │   ├── search/
   │   ├── queue/
   │   ├── player/
   │   └── room/
   ├── pages/
   ├── lib/
   │   ├── supabase.ts
   │   ├── youtube.ts
   │   └── utils.ts
   ├── hooks/
   ├── types/
   └── store/

6. Set up environment variables in .env.local:
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   VITE_YOUTUBE_API_KEY=

7. Configure tsconfig.json with path aliases (@/ for src/)
8. Add Prettier and ESLint with TypeScript support
9. Create .gitignore with .env.local
```

**Acceptance Criteria:**
- [ ] Project builds without errors
- [ ] Tailwind CSS working
- [ ] TypeScript strict mode enabled
- [ ] All imports resolve correctly
- [ ] Dev server runs on http://localhost:5173

---

### ✅ Task 1.2: Supabase Setup

**Manual Steps:**
1. Go to https://supabase.com
2. Create new project
3. Get URL and anon key from Settings > API
4. Add to `.env.local`

**Prompt for Cursor:**
```
Create a Supabase client configuration in src/lib/supabase.ts:

1. Initialize Supabase client with env variables
2. Add TypeScript types for our database schema (we'll define schema next)
3. Export typed client
4. Add helper functions for common operations
5. Set up proper error handling

Use the latest @supabase/supabase-js patterns.
```

**Acceptance Criteria:**
- [ ] Supabase client initializes without errors
- [ ] TypeScript autocomplete works for Supabase methods
- [ ] Environment variables load correctly

---

### ✅ Task 1.3: YouTube API Setup

**Manual Steps:**
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable YouTube Data API v3
4. Create API key (restrict to YouTube Data API only)
5. Add to `.env.local`

**Prompt for Cursor:**
```
Create YouTube API service in src/lib/youtube.ts:

1. Create a search function that:
   - Searches YouTube with query: "{songName} karaoke"
   - Filters results to only include videos with "karaoke" in title
   - Returns: videoId, title, thumbnail (maxresdefault), channelName, duration
   - Handles API quota limits gracefully
   - Uses TanStack Query for caching

2. Create TypeScript interfaces:
   - YouTubeVideo
   - YouTubeSearchResponse
   - YouTubeSearchParams

3. Add error handling for:
   - Network failures
   - API quota exceeded
   - Invalid API key
   - No results found

4. Implement rate limiting (max 10 requests per minute)
5. Cache results for 1 hour

Use modern fetch with AbortController for request cancellation.
```

**Acceptance Criteria:**
- [ ] Search returns valid YouTube videos
- [ ] Only karaoke videos in results
- [ ] Error handling works for all cases
- [ ] Rate limiting prevents API quota issues

---

## 🗄️ PHASE 2: DATABASE SCHEMA

### ✅ Task 2.1: Create Database Tables

**Prompt for Cursor:**
```
Create SQL migration for Supabase with these tables:

1. users table:
   - id (uuid, primary key, references auth.users)
   - email (text)
   - display_name (text, default 'Guest_{random}')
   - avatar_url (text, nullable)
   - subscription_tier (enum: 'free', 'basic', 'pro', 'business')
   - subscription_expires_at (timestamp, nullable)
   - created_at (timestamp with time zone, default now())
   - updated_at (timestamp with time zone, default now())

2. rooms table:
   - id (uuid, primary key, default uuid_generate_v4())
   - name (text, not null)
   - code (text, unique, 6 characters, uppercase)
   - host_user_id (uuid, references users(id))
   - type (enum: 'home', 'business')
   - is_active (boolean, default true)
   - settings (jsonb, for custom configurations)
   - created_at (timestamp with time zone, default now())
   - expires_at (timestamp with time zone, nullable)

3. queue_items table:
   - id (uuid, primary key, default uuid_generate_v4())
   - room_id (uuid, references rooms(id) on delete cascade)
   - video_id (text, not null)
   - video_title (text, not null)
   - video_thumbnail (text, not null)
   - video_duration (integer, seconds)
   - added_by_user_id (uuid, references users(id))
   - added_by_name (text, not null)
   - position (integer, not null)
   - played_at (timestamp with time zone, nullable)
   - skipped (boolean, default false)
   - created_at (timestamp with time zone, default now())

4. playlists table:
   - id (uuid, primary key, default uuid_generate_v4())
   - user_id (uuid, references users(id) on delete cascade)
   - name (text, not null)
   - description (text)
   - is_public (boolean, default false)
   - play_count (integer, default 0)
   - created_at (timestamp with time zone, default now())
   - updated_at (timestamp with time zone, default now())

5. playlist_songs table:
   - id (uuid, primary key, default uuid_generate_v4())
   - playlist_id (uuid, references playlists(id) on delete cascade)
   - video_id (text, not null)
   - video_title (text, not null)
   - video_thumbnail (text, not null)
   - position (integer, not null)
   - created_at (timestamp with time zone, default now())

Add indexes for:
- rooms.code
- rooms.host_user_id
- queue_items.room_id
- queue_items.position
- playlists.user_id
- playlist_songs.playlist_id

Add updated_at trigger for users and playlists tables.
```

**Manual Step:** Run SQL in Supabase SQL Editor

**Acceptance Criteria:**
- [ ] All tables created successfully
- [ ] Foreign keys working
- [ ] Indexes created
- [ ] Triggers active

---

### ✅ Task 2.2: Set Up Row Level Security (RLS)

**Prompt for Cursor:**
```
Create RLS policies for all tables:

users table:
- Users can read their own data
- Users can update their own display_name and avatar_url
- Service role can do anything

rooms table:
- Anyone can read active rooms by code
- Only authenticated users can create rooms
- Only host can update/delete their rooms
- Service role can do anything

queue_items table:
- Anyone can read queue items for rooms they're in
- Anyone can insert queue items
- Only host or item creator can delete items
- Only host can update items (reordering)

playlists table:
- Users can CRUD their own playlists
- Anyone can read public playlists
- Service role can do anything

playlist_songs table:
- Users can CRUD songs in their playlists
- Anyone can read songs in public playlists

Generate the exact SQL for these policies.
```

**Manual Step:** Run SQL in Supabase SQL Editor

**Acceptance Criteria:**
- [ ] RLS enabled on all tables
- [ ] Policies tested with different user roles
- [ ] No unauthorized access possible

---

### ✅ Task 2.3: Enable Real-Time

**Prompt for Cursor:**
```
Generate SQL to enable real-time subscriptions:

1. Enable real-time for queue_items table
2. Enable real-time for rooms table
3. Configure real-time to broadcast INSERT, UPDATE, DELETE events
4. Set up proper filters so users only get updates for their room

Provide the SQL commands needed.
```

**Manual Step:** Run SQL in Supabase SQL Editor

**Acceptance Criteria:**
- [ ] Real-time working for queue updates
- [ ] Real-time working for room status
- [ ] No lag in updates (<500ms)

---

## 🎨 PHASE 3: CORE UI COMPONENTS

### ✅ Task 3.1: shadcn/ui Components

**Prompt for Cursor:**
```
Install and configure these shadcn/ui components:

npx shadcn@latest add button card input dialog tabs toast dropdown-menu select separator skeleton avatar badge scroll-area

After installation:
1. Verify all components render correctly
2. Create a demo page showing each component
3. Customize theme colors in tailwind.config.js to match karaoke vibe:
   - Primary: purple/pink gradient
   - Secondary: blue
   - Accent: yellow/gold
   - Background: dark theme optimized
4. Set up dark mode with next-themes
```

**Acceptance Criteria:**
- [ ] All components installed
- [ ] Theme customized
- [ ] Dark mode working
- [ ] Components render without style issues

---

### ✅ Task 3.2: Layout Components

**Prompt for Cursor:**
```
Create base layout components:

1. src/components/layout/AppLayout.tsx:
   - Main app container
   - Responsive padding
   - Max width constraint
   - Background gradient

2. src/components/layout/Header.tsx:
   - App logo/name
   - Navigation (conditional based on auth)
   - User menu dropdown
   - Dark mode toggle

3. src/components/layout/Footer.tsx:
   - Copyright
   - Links (about, privacy, terms)
   - Social icons

Use TypeScript, proper prop types, and mobile-first responsive design.
```

**Acceptance Criteria:**
- [ ] Layout renders correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Navigation working
- [ ] Dark mode toggle functional

---

## 🏠 PHASE 4: ROOM MANAGEMENT

### ✅ Task 4.1: Home Page

**Prompt for Cursor:**
```
Create src/pages/Home.tsx:

1. Hero section with:
   - Catchy headline: "Turn Any Screen Into a Karaoke Machine"
   - Subheading explaining the concept
   - Two CTA buttons: "Create Room" and "Join Room"

2. Features section highlighting:
   - YouTube integration
   - Real-time queue
   - Mobile control
   - No downloads needed

3. Use Framer Motion for scroll animations
4. Make it visually appealing with gradients and glassmorphism
5. Fully responsive

Use shadcn/ui components and Tailwind CSS.
```

**Acceptance Criteria:**
- [ ] Page loads fast (<2s)
- [ ] Animations smooth (60fps)
- [ ] CTAs clearly visible
- [ ] Mobile responsive

---

### ✅ Task 4.2: Create Room Flow

**Prompt for Cursor:**
```
Create room creation system:

1. src/components/room/CreateRoomDialog.tsx:
   - Dialog with form
   - Fields: room name, room type (home/business)
   - Generate unique 6-char uppercase code (check uniqueness)
   - Save to Supabase rooms table
   - Handle loading and error states
   - Use React Hook Form + Zod validation

2. src/lib/room-utils.ts:
   - generateRoomCode() function
   - checkCodeUniqueness() function
   - createRoom() function

3. After creation:
   - Navigate to /room/:code (host view)
   - Show success toast with room code
   - Copy room code to clipboard option

Use TanStack Query for Supabase mutations.
```

**Acceptance Criteria:**
- [ ] Room code always unique
- [ ] Form validation working
- [ ] Error handling for duplicates
- [ ] Navigation works after creation

---

### ✅ Task 4.3: Join Room Flow

**Prompt for Cursor:**
```
Create room joining system:

1. src/components/room/JoinRoomDialog.tsx:
   - Dialog with single input field for room code
   - Auto-uppercase input
   - 6-character limit
   - Validate code exists in Supabase
   - Check if room is active
   - Handle invalid code error
   - Use React Hook Form + Zod

2. On valid code:
   - Navigate to /room/:code (guest view)
   - Prompt for display name if not set
   - Show success toast

Use TanStack Query for validation query.
```

**Acceptance Criteria:**
- [ ] Code validation works
- [ ] Error messages clear
- [ ] Guest can join active room
- [ ] Invalid codes rejected

---

### ✅ Task 4.4: Room State Management

**Prompt for Cursor:**
```
Create Zustand store for room state in src/store/roomStore.ts:

1. Store should track:
   - currentRoom (room data)
   - userRole ('host' | 'guest')
   - userName (display name)
   - isConnected (real-time connection status)

2. Actions:
   - setCurrentRoom(room)
   - setUserRole(role)
   - setUserName(name)
   - leaveRoom()
   - updateConnectionStatus(status)

3. Add persistence with zustand/middleware (persist to localStorage)
4. Add TypeScript types for all state and actions
5. Export hooks: useRoomStore, useCurrentRoom, useUserRole

Use Zustand 5+ patterns with proper TypeScript inference.
```

**Acceptance Criteria:**
- [ ] Store initializes correctly
- [ ] State persists on refresh
- [ ] Actions update state properly
- [ ] TypeScript autocomplete works

---

## 🎵 PHASE 5: SEARCH & QUEUE SYSTEM

### ✅ Task 5.1: Search Component

**Prompt for Cursor:**
```
Create YouTube search system:

1. src/components/search/SearchBar.tsx:
   - Input with search icon
   - Debounced search (500ms)
   - Loading spinner while searching
   - Clear button
   - Keyboard shortcut (/ to focus)
   - Use useDebounce hook

2. src/components/search/SearchResults.tsx:
   - Grid layout (responsive: 1 col mobile, 2 tablet, 3 desktop)
   - Each result card shows:
     * Thumbnail (hover zoom effect)
     * Title (truncated to 2 lines)
     * Channel name
     * Duration badge
     * "Add to Queue" button
   - Empty state if no results
   - Skeleton loading state
   - Infinite scroll (optional, for Phase 2)

3. src/hooks/useYouTubeSearch.ts:
   - Custom hook using TanStack Query
   - Integrates with youtube.ts service
   - Handles caching and refetching
   - Returns: { data, isLoading, error, refetch }

Use Framer Motion for card animations.
```

**Acceptance Criteria:**
- [ ] Search returns results fast (<1s)
- [ ] Debouncing prevents excessive API calls
- [ ] Results display correctly
- [ ] Responsive layout works

---

### ✅ Task 5.2: Queue Component

**Prompt for Cursor:**
```
Create queue management system:

1. src/components/queue/QueueList.tsx:
   - Displays all songs in queue
   - Real-time updates via Supabase subscription
   - Drag-and-drop reordering (use @dnd-kit)
   - Only host can reorder
   - Empty state if queue empty
   - Show "Now Playing" marker on first item

2. src/components/queue/QueueItem.tsx:
   - Thumbnail + title + added by name
   - Remove button (only for host or song adder)
   - Position number
   - Drag handle (for host only)
   - Hover effects

3. src/hooks/useQueue.ts:
   - Custom hook for queue operations
   - Functions:
     * addToQueue(videoData)
     * removeFromQueue(itemId)
     * reorderQueue(oldIndex, newIndex)
     * subscribeToQueue(roomId)
   - Uses TanStack Query + Supabase real-time
   - Optimistic updates for better UX

Use sonner for toast notifications on add/remove.
```

**Acceptance Criteria:**
- [ ] Real-time sync works (<500ms delay)
- [ ] Drag-and-drop smooth
- [ ] Host controls working
- [ ] Toast notifications show

---

### ✅ Task 5.3: Add to Queue Logic

**Prompt for Cursor:**
```
Implement add to queue functionality:

1. When user clicks "Add to Queue":
   - Check if user is in a room (from Zustand store)
   - Get user's display name
   - Insert into queue_items table:
     * room_id
     * video_id, video_title, video_thumbnail, video_duration
     * added_by_user_id, added_by_name
     * position (calculate: max(position) + 1)
   - Show success toast: "Added {title} to queue"
   - Disable button temporarily to prevent duplicates

2. Handle errors:
   - Not in a room: prompt to join
   - Network error: show retry option
   - Duplicate song: show warning (optional)

3. Add optimistic update:
   - Show song in queue immediately
   - Roll back if mutation fails

Use TanStack Query mutation with onSuccess/onError callbacks.
```

**Acceptance Criteria:**
- [ ] Song adds to queue successfully
- [ ] Optimistic updates work
- [ ] Error handling graceful
- [ ] No duplicate adds possible

---

## 🎬 PHASE 6: VIDEO PLAYER

### ✅ Task 6.1: YouTube Player Component

**Prompt for Cursor:**
```
Create YouTube player integration:

1. src/components/player/VideoPlayer.tsx:
   - Embed YouTube IFrame Player API
   - Load API script dynamically
   - Create player instance with these settings:
     * autoplay: 1
     * controls: 0 (we'll make custom controls)
     * disablekb: 1
     * modestbranding: 1
     * rel: 0
   - Handle player events:
     * onReady
     * onStateChange (playing, paused, ended)
     * onError
   - Auto-play next song when current ends
   - Full-screen capable

2. src/components/player/PlayerControls.tsx:
   - Play/pause button
   - Next song button
   - Volume slider
   - Progress bar (current time / total time)
   - Key adjustment (+/- semitones) [Phase 2]
   - Full-screen toggle
   - Only show controls for host

3. src/hooks/useYouTubePlayer.ts:
   - Manage player instance
   - State: isPlaying, volume, currentTime, duration
   - Functions: play(), pause(), seekTo(), setVolume(), skipToNext()

Use TypeScript for YouTube API types (install @types/youtube if needed).
```

**Acceptance Criteria:**
- [ ] Player loads and plays videos
- [ ] Auto-advance to next song works
- [ ] Controls functional
- [ ] Full-screen works

---

### ✅ Task 6.2: TV Mode Page

**Prompt for Cursor:**
```
Create TV display mode:

1. src/pages/TVMode.tsx:
   - Full-screen layout (no header/footer)
   - Video player takes 70% of screen
   - Bottom section shows:
     * Current song title (large text)
     * Up next preview (thumbnail + title)
     * Room code in corner
   - Display queue on side panel (collapsible)
   - Dark theme optimized
   - Prevent screen sleep (use Wake Lock API)

2. Features:
   - QR code for room joining (display in corner)
   - Lyrics sync (Phase 2 - requires external API)
   - Visualizer during no video (optional)

3. Route: /tv/:roomCode
   - Only accessible if room exists
   - Real-time sync with queue

Use Framer Motion for smooth transitions between songs.
```

**Acceptance Criteria:**
- [ ] Displays correctly on 1080p TV
- [ ] Auto-plays queue
- [ ] QR code scannable
- [ ] No UI flicker between songs

---

## 📱 PHASE 7: MOBILE CONTROLLER

### ✅ Task 7.1: Controller Interface

**Prompt for Cursor:**
```
Create mobile remote control:

1. src/pages/Controller.tsx:
   - Tab navigation:
     * Search (YouTube search component)
     * Queue (current queue list)
     * Now Playing (current song display)
     * My Songs (filter queue by user)

2. Now Playing tab:
   - Large thumbnail
   - Song title + channel
   - Progress bar
   - Host controls (if user is host):
     * Play/pause button
     * Skip button
     * Volume control
   - Guest view (if not host):
     * Just displays info, no controls

3. My Songs tab:
   - Filter queue by current user
   - Remove button for each song
   - Empty state if no songs

4. Route: /room/:roomCode
   - Detects if mobile vs desktop
   - Mobile: show controller
   - Desktop: show TV mode

Use mobile-first responsive design.
```

**Acceptance Criteria:**
- [ ] Tab navigation smooth
- [ ] Controls only show for host
- [ ] Mobile responsive
- [ ] Real-time updates work

---

### ✅ Task 7.2: QR Code Generation

**Prompt for Cursor:**
```
Add QR code for easy room joining:

1. src/components/room/RoomQRCode.tsx:
   - Generate QR code with room URL
   - URL format: https://yourdomain.com/join/:roomCode
   - Display in dialog on TV mode
   - Download QR as image option
   - Use react-qr-code library

2. Auto-show QR code:
   - Display for 10 seconds on room creation
   - Show again via button in TV mode
   - Include room code text below QR

Style with glassmorphism card effect.
```

**Acceptance Criteria:**
- [ ] QR code generates correctly
- [ ] Scanning QR joins room
- [ ] Download works
- [ ] Visible on TV

---

## 🔐 PHASE 8: AUTHENTICATION

### ✅ Task 8.1: Auth Setup

**Prompt for Cursor:**
```
Implement Supabase authentication:

1. src/lib/auth.ts:
   - signUp(email, password, displayName)
   - signIn(email, password)
   - signInWithGoogle()
   - signOut()
   - updateProfile(displayName, avatarUrl)
   - resetPassword(email)
   - Helper: getCurrentUser()

2. src/hooks/useAuth.ts:
   - Custom hook wrapping auth functions
   - Returns: { user, isLoading, isAuthenticated, signIn, signOut, etc. }
   - Uses TanStack Query for user state

3. src/components/auth/AuthDialog.tsx:
   - Tabs: "Sign In" and "Sign Up"
   - Email/password form
   - Google OAuth button
   - "Forgot password" link
   - Error handling
   - Use React Hook Form + Zod validation

4. Anonymous users:
   - Generate random display name: "Guest_XXXX"
   - Store in localStorage
   - Prompt to create account for saving playlists

Configure Supabase Auth settings (email templates, OAuth providers).
```

**Acceptance Criteria:**
- [ ] Email auth works
- [ ] Google OAuth works
- [ ] Anonymous users can participate
- [ ] Profile updates work

---

### ✅ Task 8.2: Protected Routes

**Prompt for Cursor:**
```
Add route protection:

1. Create ProtectedRoute component:
   - Checks authentication
   - Redirects to sign in if not authenticated
   - Shows loading spinner during check

2. Protect these routes:
   - /dashboard (business users)
   - /playlists (authenticated users)
   - /settings (authenticated users)

3. Public routes:
   - / (home)
   - /room/:code (anyone can join)
   - /tv/:code (public display)

Use React Router 7 loaders or TanStack Router auth guards.
```

**Acceptance Criteria:**
- [ ] Protected routes redirect
- [ ] Public routes accessible
- [ ] Auth state persists on refresh
- [ ] Loading states show

---

## 📚 PHASE 9: PLAYLISTS

### ✅ Task 9.1: Playlist Management

**Prompt for Cursor:**
```
Create playlist feature:

1. src/pages/Playlists.tsx:
   - Display user's playlists (grid layout)
   - "Create Playlist" button
   - Each playlist card shows:
     * Name
     * Song count
     * Thumbnail collage (first 4 songs)
     * Edit/delete buttons
     * "Add to Queue" button

2. src/components/playlists/PlaylistDialog.tsx:
   - Create/edit playlist form
   - Fields: name, description, public/private toggle
   - Use React Hook Form + Zod

3. src/components/playlists/PlaylistDetail.tsx:
   - View songs in playlist
   - Add new songs (YouTube search)
   - Reorder songs (drag-and-drop)
   - Remove songs
   - "Add All to Queue" button

4. src/hooks/usePlaylists.ts:
   - CRUD operations for playlists
   - addSongToPlaylist()
   - removeSongFromPlaylist()
   - addPlaylistToQueue()

Use TanStack Query for server state management.
```

**Acceptance Criteria:**
- [ ] CRUD operations work
- [ ] Drag-and-drop reordering
- [ ] Public/private toggle works
- [ ] Add all to queue works

---

### ✅ Task 9.2: Community Playlists

**Prompt for Cursor:**
```
Add public playlist discovery:

1. src/pages/DiscoverPlaylists.tsx:
   - Browse public playlists
   - Sort by: most played, newest, trending
   - Search by name
   - Filter by genre (if we add genre tags)
   - Infinite scroll

2. Playlist cards show:
   - Creator name
   - Play count
   - Song count
   - Preview button (opens detail modal)

3. Anyone can add public playlists to their queue
4. Track play_count when playlists are used

Use TanStack Query infinite query for pagination.
```

**Acceptance Criteria:**
- [ ] Public playlists visible
- [ ] Sorting works
- [ ] Search functional
- [ ] Play count increments

---

## 🎚️ PHASE 10: ADVANCED PLAYER FEATURES

### ✅ Task 10.1: Key Adjustment

**Prompt for Cursor:**
```
Add pitch shifting for key changes:

1. Use Web Audio API:
   - Create AudioContext
   - Connect YouTube audio to AudioContext
   - Apply pitch shift (-6 to +6 semitones)
   - Maintain tempo (no slowdown/speedup)

2. UI in PlayerControls:
   - "-" button (lower key)
   - Key display (e.g., "+2")
   - "+" button (raise key)
   - Reset button

3. Handle limitations:
   - Some browsers don't support pitch shift
   - Show warning if not supported
   - Graceful fallback

Note: Perfect pitch shifting is complex. For MVP, use simple playbackRate adjustment with audio graph. For production, consider using Tone.js library.
```

**Acceptance Criteria:**
- [ ] Key adjustment works (basic)
- [ ] UI controls functional
- [ ] Browser support detected
- [ ] Fallback for unsupported browsers

---

### ✅ Task 10.2: Vocal Removal (Basic)

**Prompt for Cursor:**
```
Add basic vocal removal toggle:

1. Use Web Audio API:
   - Create stereo splitter
   - Invert phase of one channel
   - Merge channels (center vocals cancel out)
   - This is the "karaoke effect" - removes center-panned vocals

2. UI toggle in PlayerControls:
   - "Vocal Removal" switch
   - Works best on studio recordings
   - Show disclaimer: "Works best on certain tracks"

3. Limitations:
   - Not AI-powered (that's Phase 2)
   - Only removes center-panned audio
   - May affect other instruments

For better quality, consider integrating:
- Spleeter API (self-hosted)
- Lalal.ai API (paid)
- Moises API (paid)

Implement basic version for MVP.
```

**Acceptance Criteria:**
- [ ] Toggle works
- [ ] Audio quality acceptable
- [ ] Disclaimer visible
- [ ] No audio distortion

---

## 💼 PHASE 11: BUSINESS DASHBOARD

### ✅ Task 11.1: Business Admin Layout

**Prompt for Cursor:**
```
Create business admin dashboard:

1. src/pages/Dashboard.tsx:
   - Sidebar navigation:
     * Overview
     * Active Rooms
     * Analytics
     * Settings
     * Billing
   - Main content area
   - Responsive (collapsible sidebar on mobile)
   - Only accessible to business tier users

2. Check subscription tier:
   - Fetch user subscription from Supabase
   - Redirect free/basic users with upgrade prompt
   - Show trial banner if applicable

3. Use shadcn/ui sidebar component
4. Add breadcrumb navigation

Route: /dashboard (protected)
```

**Acceptance Criteria:**
- [ ] Dashboard loads only for business users
- [ ] Navigation works
- [ ] Responsive on mobile
- [ ] Subscription check works

---

### ✅ Task 11.2: Multi-Room Management

**Prompt for Cursor:**
```
Build room management interface:

1. src/pages/dashboard/Rooms.tsx:
   - Display all rooms (owned by business)
   - Grid/list view toggle
   - Each room card shows:
     * Room name
     * Status (active/inactive)
     * Current song playing
     * Queue length
     * Active users count
     * Created date
   - "Create Room" button
   - "View Room" button (opens TV mode in new tab)
   - "Delete Room" button (with confirmation)

2. Real-time updates:
   - Subscribe to all owned rooms
   - Update status indicators live
   - Show notification when room becomes active

3. Bulk actions:
   - Select multiple rooms
   - Bulk delete
   - Bulk activate/deactivate

Use TanStack Query for room data + Supabase real-time.
```

**Acceptance Criteria:**
- [ ] All rooms display correctly
- [ ] Real-time updates work
- [ ] Bulk actions functional
- [ ] Room limit enforced per tier

---

### ✅ Task 11.3: Analytics Dashboard

**Prompt for Cursor:**
```
Create analytics page:

1. src/pages/dashboard/Analytics.tsx:
   - Date range selector (today, week, month, custom)
   - Key metrics cards:
     * Total songs played
     * Total session time
     * Active rooms (current)
     * Unique users
   - Charts (use Recharts library):
     * Songs played over time (line chart)
     * Peak hours heatmap
     * Most played songs (bar chart)
     * Room activity (area chart)
   - Export data as CSV

2. src/lib/analytics.ts:
   - Query functions for analytics data
   - Aggregate queue_items for stats
   - Cache results (1 hour)

3. Add filters:
   - By room
   - By date range
   - By song genre (if we add tags)

Use Recharts 2.x for visualizations.
```

**Acceptance Criteria:**
- [ ] Metrics calculate correctly
- [ ] Charts render smoothly
- [ ] Date filtering works
- [ ] CSV export functional

---

### ✅ Task 11.4: Room Settings

**Prompt for Cursor:**
```
Add business room configuration:

1. src/pages/dashboard/RoomSettings.tsx:
   - Global settings for all rooms:
     * Auto-skip after X minutes
     * Max queue length per user
     * Explicit content filter (on/off)
     * Allow duplicates (on/off)
     * Require display name (on/off)
   - Per-room settings override
   - Custom branding:
     * Upload logo
     * Primary color picker
     * Custom welcome message

2. Save settings to rooms.settings (JSONB column)
3. Apply settings in player logic
4. Use React Hook Form for settings form

Store logo in Supabase Storage bucket.
```

**Acceptance Criteria:**
- [ ] Settings save correctly
- [ ] Per-room overrides work
- [ ] Branding applies in TV mode
- [ ] Logo upload works

---

## 💳 PHASE 12: MONETIZATION

### ✅ Task 12.1: Stripe Setup

**Manual Steps:**
1. Create Stripe account
2. Get API keys (test + production)
3. Create products in Stripe:
   - Basic: $9.99/month (5 playlists, priority support)
   - Pro: $19.99/month (unlimited playlists, vocal removal, no ads)
   - Business: $49/month per room (analytics, multi-room, branding)

**Prompt for Cursor:**
```
Integrate Stripe for subscriptions:

1. Install: stripe, @stripe/stripe-js, @stripe/react-stripe-js

2. src/lib/stripe.ts:
   - Initialize Stripe client
   - loadStripe() function
   - Create checkout session function
   - Create customer portal session

3. Environment variables:
   VITE_STRIPE_PUBLIC_KEY=
   STRIPE_SECRET_KEY= (backend only)

4. Supabase Edge Functions:
   - create-checkout-session
   - create-portal-session
   - webhook handler (for subscription events)

5. Store subscription data in users table:
   - subscription_tier
   - subscription_expires_at
   - stripe_customer_id

Use Stripe Checkout for payment flow.
```

**Acceptance Criteria:**
- [ ] Checkout opens correctly
- [ ] Payment processes
- [ ] Subscription status updates
- [ ] Webhook receives events

---

### ✅ Task 12.2: Pricing Page

**Prompt for Cursor:**
```
Create pricing page:

1. src/pages/Pricing.tsx:
   - Three-tier pricing cards:
     * Free (current features)
     * Basic (highlighted features)
     * Pro (all features)
     * Business (custom quote or fixed price)
   - Annual/monthly toggle (show savings)
   - Feature comparison table
   - FAQ section
   - Testimonials (optional)

2. Each pricing card:
   - Price (with strikethrough for annual savings)
   - Feature list with checkmarks
   - "Get Started" CTA
   - Popular badge (on Pro tier)

3. On CTA click:
   - If not authenticated: prompt sign up
   - If authenticated: redirect to Stripe Checkout

Use Framer Motion for card hover effects.
```

**Acceptance Criteria:**
- [ ] Pricing clearly displayed
- [ ] Annual toggle calculates correctly
- [ ] CTAs work
- [ ] Responsive layout

---

### ✅ Task 12.3: Subscription Management

**Prompt for Cursor:**
```
Build user subscription management:

1. src/pages/Settings.tsx (Billing tab):
   - Current plan display
   - Renewal date
   - "Upgrade" button (if not on highest tier)
   - "Manage Subscription" button (opens Stripe portal)
   - "Cancel Subscription" button
   - Payment method display

2. Feature gating:
   - Check subscription tier before allowing features
   - Show "Upgrade to Pro" prompts
   - Disable premium features for free/expired users

3. Grace period handling:
   - 3-day grace period after expiration
   - Show warning banner
   - Soft-lock premium features

4. Subscription upgrade flow:
   - Prorate charges
   - Immediate access to new features
   - Show success notification

Use Stripe Customer Portal for self-service management.
```

**Acceptance Criteria:**
- [ ] Current plan displays correctly
- [ ] Upgrade/downgrade works
- [ ] Cancellation works
- [ ] Grace period enforced

---

## 🧪 PHASE 13: TESTING & OPTIMIZATION

### ✅ Task 13.1: Unit Tests

**Prompt for Cursor:**
```
Set up testing infrastructure:

1. Install: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event

2. Create test files for:
   - src/lib/room-utils.test.ts
     * Test generateRoomCode() uniqueness
     * Test code format (6 chars, uppercase)
   - src/lib/youtube.test.ts
     * Mock API responses
     * Test search parsing
     * Test error handling
   - src/hooks/useQueue.test.ts
     * Test queue operations
     * Test optimistic updates
   - src/components/queue/QueueItem.test.tsx
     * Test rendering
     * Test remove button
     * Test drag handle

3. Configure vitest.config.ts
4. Add test scripts to package.json
5. Set up GitHub Actions for CI (optional)

Aim for 80%+ coverage on critical functions.
```

**Acceptance Criteria:**
- [ ] Tests run successfully
- [ ] Coverage report generated
- [ ] CI pipeline works (if set up)
- [ ] Critical paths tested

---

### ✅ Task 13.2: Performance Optimization

**Prompt for Cursor:**
```
Optimize application performance:

1. Code splitting:
   - Lazy load routes with React.lazy
   - Lazy load heavy components (player, analytics)
   - Split vendor bundles

2. Image optimization:
   - Use loading="lazy" on images
   - Implement blur placeholder for thumbnails
   - Use WebP format where possible
   - Add image CDN (Cloudinary or Cloudflare)

3. Query optimization:
   - Review TanStack Query cache times
   - Implement stale-while-revalidate
   - Add prefetching for likely next pages

4. Supabase optimization:
   - Add database indexes (review EXPLAIN ANALYZE)
   - Optimize RLS policies
   - Use select specific columns (not *)
   - Implement pagination for large lists

5. Bundle size:
   - Analyze with vite-bundle-visualizer
   - Remove unused dependencies
   - Tree-shake libraries

6. Lighthouse audit:
   - Score 90+ on Performance
   - Score 95+ on Accessibility
   - Score 100 on Best Practices
   - Score 100 on SEO

Generate a performance report and optimization plan.
```

**Acceptance Criteria:**
- [ ] Bundle size < 500KB (initial load)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse scores meet targets

---

### ✅ Task 13.3: Error Handling & Logging

**Prompt for Cursor:**
```
Implement comprehensive error handling:

1. Error boundaries:
   - src/components/ErrorBoundary.tsx
   - Catch React errors
   - Show friendly error UI
   - Log errors to service

2. Global error handler:
   - Catch unhandled promise rejections
   - Network errors
   - Supabase errors
   - YouTube API errors

3. Error logging service:
   - Option 1: Sentry (recommended)
   - Option 2: LogRocket
   - Option 3: Custom logging to Supabase

4. User-friendly error messages:
   - No raw error stacks shown to users
   - Actionable error messages
   - Retry options where applicable
   - Support contact link

5. Development vs Production:
   - Detailed errors in dev
   - Sanitized errors in production
   - Error reporting only in production

Install Sentry: @sentry/react @sentry/vite-plugin
```

**Acceptance Criteria:**
- [ ] All errors caught
- [ ] Error reporting working
- [ ] User sees friendly messages
- [ ] Error logs accessible

---

## 📱 PHASE 14: PWA & MOBILE

### ✅ Task 14.1: Progressive Web App

**Prompt for Cursor:**
```
Convert to PWA:

1. Install: vite-plugin-pwa

2. Create manifest.json:
   - App name: "YouTube Karaoke"
   - Short name: "YT Karaoke"
   - Theme color: (your primary color)
   - Background color: (your bg color)
   - Display: standalone
   - Icons: 192x192, 512x512 (generate with PWA Asset Generator)

3. Service worker:
   - Cache YouTube thumbnails
   - Cache static assets
   - Network-first for API calls
   - Cache-first for images

4. Add to home screen prompt:
   - Detect if PWA installable
   - Show install banner (iOS and Android)
   - Hide after installation

5. Offline support:
   - Show offline indicator
   - Cache queue data locally
   - Sync when back online

6. Push notifications (optional):
   - Notify when it's your turn (5 songs before)
   - Room activity notifications

Configure in vite.config.ts with PWA plugin.
```

**Acceptance Criteria:**
- [ ] PWA installable on mobile
- [ ] Works offline (basic features)
- [ ] Icons display correctly
- [ ] Splash screen shows

---

### ✅ Task 14.2: Mobile Optimizations

**Prompt for Cursor:**
```
Optimize for mobile devices:

1. Touch optimizations:
   - Increase tap target sizes (min 44x44px)
   - Add touch feedback (active states)
   - Implement swipe gestures:
     * Swipe to remove from queue
     * Swipe between tabs
   - Use react-swipeable library

2. Mobile UX improvements:
   - Bottom navigation (instead of sidebar on mobile)
   - Pull-to-refresh for queue
   - Haptic feedback on actions (use Vibration API)
   - Auto-hide keyboard after search
   - Prevent zoom on input focus

3. Performance:
   - Reduce animation complexity on mobile
   - Lazy load images aggressively
   - Reduce real-time update frequency on mobile

4. Mobile-specific features:
   - Share room via native share sheet
   - Scan QR with camera
   - Save to contacts with room link

Test on actual devices: iPhone, Android, iPad.
```

**Acceptance Criteria:**
- [ ] App feels native on mobile
- [ ] Touch interactions smooth
- [ ] No layout shift issues
- [ ] Tested on real devices

---

## 🚀 PHASE 15: DEPLOYMENT

### ✅ Task 15.1: Production Build

**Prompt for Cursor:**
```
Prepare production build:

1. Environment variables:
   - Create .env.production with prod values
   - Never commit .env files
   - Document all required env vars in .env.example

2. Build optimizations:
   - Enable minification
   - Enable code splitting
   - Enable compression (gzip, brotli)
   - Set NODE_ENV=production

3. Security headers:
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Permissions-Policy

4. Update package.json scripts:
   - build: vite build
   - preview: vite preview
   - typecheck: tsc --noEmit

5. Pre-deployment checklist:
   - All tests passing
   - No console errors
   - Lighthouse audit passed
   - TypeScript strict checks passing
   - Security audit (npm audit)

Generate a deployment checklist.
```

**Acceptance Criteria:**
- [ ] Production build succeeds
- [ ] No build warnings
- [ ] Security headers set
- [ ] Build size < 1MB

---

### ✅ Task 15.2: Deploy to Vercel

**Prompt for Cursor:**
```
Deploy to Vercel:

1. Install Vercel CLI: npm i -g vercel

2. Create vercel.json:
   - Set build command
   - Set output directory
   - Configure rewrites for SPA routing
   - Set environment variables

3. Connect GitHub repo:
   - Enable automatic deployments
   - Deploy on push to main
   - Preview deployments for PRs

4. Configure domains:
   - Add custom domain
   - Set up SSL (automatic with Vercel)
   - Configure DNS

5. Set environment variables in Vercel dashboard:
   - Supabase URL and keys
   - YouTube API key
   - Stripe keys
   - Sentry DSN

6. Enable Vercel features:
   - Analytics
   - Speed Insights
   - Web Vitals monitoring

7. Set up deployment protection:
   - Vercel Authentication for preview deployments
   - IP allowlist (optional)

Run: vercel --prod
```

**Acceptance Criteria:**
- [ ] App deployed successfully
- [ ] Custom domain working
- [ ] SSL certificate active
- [ ] Environment variables set

---

### ✅ Task 15.3: Supabase Production

**Prompt for Cursor:**
```
Production Supabase setup:

1. Database:
   - Review all RLS policies (test with different users)
   - Add missing indexes (check slow query log)
   - Set up automated backups (daily)
   - Configure connection pooling
   - Review and optimize slow queries

2. Auth:
   - Set up email templates (confirmation, reset, invite)
   - Configure OAuth redirects
   - Set up rate limiting
   - Review auth hooks

3. Storage:
   - Set up storage buckets (user-avatars, room-logos)
   - Configure RLS policies for storage
   - Set file size limits
   - Enable image transformations

4. Edge Functions (if used):
   - Deploy all functions
   - Set environment variables
   - Test webhook endpoints
   - Monitor function logs

5. Security:
   - Rotate API keys if exposed
   - Review CORS settings
   - Enable 2FA for admin accounts
   - Set up audit logging

6. Monitoring:
   - Enable database metrics
   - Set up alerts for high load
   - Monitor real-time connections
   - Track API usage

Create a production readiness checklist.
```

**Acceptance Criteria:**
- [ ] Database optimized
- [ ] Backups configured
- [ ] Security hardened
- [ ] Monitoring active

---

## 🎨 PHASE 16: POLISH & LAUNCH

### ✅ Task 16.1: Landing Page

**Prompt for Cursor:**
```
Create marketing landing page:

1. src/pages/Landing.tsx:
   - Hero section:
     * Compelling headline
     * Subheading
     * CTA buttons (Create Room, Try Demo)
     * Hero image/video
     * Trust badges (if applicable)
   
   - Features section:
     * 4-6 key features with icons
     * Each with title, description, illustration
   
   - How it works:
     * 3-step process
     * Visual flow diagram
   
   - Use cases:
     * Home parties
     * Bars/restaurants
     * Events
   
   - Testimonials:
     * User quotes
     * Star ratings
     * User avatars
   
   - Pricing preview:
     * Show pricing tiers
     * Link to full pricing page
   
   - FAQ section:
     * 8-10 common questions
     * Expandable accordion
   
   - Footer:
     * Links (about, contact, privacy, terms)
     * Social media
     * Newsletter signup

2. SEO optimization:
   - Meta tags (title, description, OG image)
   - Structured data (JSON-LD)
   - Sitemap
   - Robots.txt

3. Performance:
   - Hero image optimized
   - Lazy load below-fold content
   - Defer non-critical scripts

Use Framer Motion for scroll animations, parallax effects.
```

**Acceptance Criteria:**
- [ ] Landing page converts well
- [ ] Mobile responsive
- [ ] Fast load time (<2s)
- [ ] SEO optimized

---

### ✅ Task 16.2: Legal Pages

**Prompt for Cursor:**
```
Create required legal pages:

1. src/pages/Privacy.tsx:
   - Privacy policy
   - Data collection disclosure
   - Cookie policy
   - GDPR compliance
   - CCPA compliance
   - Contact for privacy concerns

2. src/pages/Terms.tsx:
   - Terms of service
   - User responsibilities
   - Service limitations
   - Refund policy
   - Dispute resolution

3. src/pages/About.tsx:
   - Mission statement
   - Team (if applicable)
   - Story/origin
   - Contact information

4. Cookie consent banner:
   - Appears on first visit
   - Allow/deny options
   - Preference storage
   - Links to privacy policy

Use a legal template generator or consult a lawyer.
Add cookie-consent library for GDPR compliance.
```

**Acceptance Criteria:**
- [ ] All legal pages present
- [ ] GDPR compliant
- [ ] Cookie consent working
- [ ] Links in footer

---

### ✅ Task 16.3: Final QA & Launch

**Prompt for Cursor:**
```
Final quality assurance checklist:

FUNCTIONALITY:
- [ ] Room creation works (100 attempts, 100% success)
- [ ] Room joining works with valid codes
- [ ] Room joining fails with invalid codes
- [ ] YouTube search returns results
- [ ] Adding to queue works
- [ ] Queue updates in real-time (<500ms)
- [ ] Video player auto-plays
- [ ] Video player advances to next song
- [ ] Controls work (play, pause, skip, volume)
- [ ] Drag-and-drop reordering works (host only)
- [ ] Remove from queue works
- [ ] Playlists CRUD works
- [ ] Authentication works (email, Google, anonymous)
- [ ] Subscription checkout works
- [ ] Subscription management works
- [ ] QR code generation works
- [ ] Mobile controller responsive

PERFORMANCE:
- [ ] Lighthouse Performance score >90
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s
- [ ] No console errors
- [ ] No memory leaks (test long sessions)

SECURITY:
- [ ] No API keys exposed in client
- [ ] RLS policies enforce permissions
- [ ] Auth tokens expire properly
- [ ] CORS configured correctly
- [ ] Rate limiting active

CROSS-BROWSER:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

RESPONSIVE:
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px, 1920px)
- [ ] TV (1080p, 4K)

ACCESSIBILITY:
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast WCAG AA
- [ ] Focus indicators visible
- [ ] Alt text on images

Launch sequence:
1. Final database backup
2. Deploy to production
3. Smoke test production
4. Enable monitoring
5. Announce launch
6. Monitor error logs

Create a launch day runbook.
```

**Acceptance Criteria:**
- [ ] All items checked
- [ ] No critical bugs
- [ ] Monitoring active
- [ ] Ready for users

---

## 📊 PHASE 17: POST-LAUNCH

### ✅ Task 17.1: Analytics & Monitoring

**Prompt for Cursor:**
```
Set up post-launch monitoring:

1. User analytics:
   - Daily/weekly/monthly active users
   - User retention rates
   - Conversion funnel (visitor → signup → paid)
   - Feature usage metrics
   - Session duration
   - Use Vercel Analytics or Plausible

2. Performance monitoring:
   - API response times
   - Database query performance
   - Error rates
   - Real-time connection stability
   - Use Vercel Speed Insights + Sentry

3. Business metrics:
   - Revenue (MRR, ARR)
   - Churn rate
   - Customer lifetime value
   - Most popular features
   - Track in Stripe Dashboard + custom dashboard

4. Create alerts:
   - Error rate >1%
   - API response time >2s
   - Database connection failures
   - Subscription payment failures

5. Weekly reports:
   - Email digest of key metrics
   - Notable events/issues
   - User feedback summary

Set up dashboards for real-time monitoring.
```

**Acceptance Criteria:**
- [ ] All metrics tracked
- [ ] Alerts configured
- [ ] Dashboards accessible
- [ ] Reports automated

---

### ✅ Task 17.2: User Feedback Loop

**Prompt for Cursor:**
```
Implement feedback collection:

1. In-app feedback widget:
   - Floating feedback button
   - Form: feedback type (bug, feature, other), message
   - Screenshot capture (optional)
   - Send to Supabase or email

2. NPS survey:
   - Show after 7 days of usage
   - "How likely are you to recommend?" (0-10)
   - Follow-up: "Why did you give this score?"
   - Track NPS over time

3. Feature request board:
   - Public board (like Canny)
   - Users can submit ideas
   - Upvote existing requests
   - Show "under consideration" / "planned" / "shipped" status

4. User interviews:
   - Calendar booking for feedback calls
   - Incentive: free month of Pro
   - Document key insights

5. Support channels:
   - Email: support@yourdomain.com
   - Discord/Slack community (optional)
   - Response time SLA: <24 hours

Use tools: Canny, Typeform, Calendly, Intercom.
```

**Acceptance Criteria:**
- [ ] Feedback widget working
- [ ] NPS tracking active
- [ ] Feature requests visible
- [ ] Support email monitored

---

### ✅ Task 17.3: Growth & Marketing

**Prompt for Cursor:**
```
Plan growth strategies:

CONTENT MARKETING:
1. Blog posts:
   - "How to Host the Perfect Karaoke Party"
   - "Top 50 Karaoke Songs of 2025"
   - "Karaoke Tips for Beginners"
   - SEO optimized, link to app

2. Video content:
   - Tutorial videos (YouTube)
   - Feature highlights (TikTok, Instagram)
   - User testimonials

3. Social media:
   - Post karaoke tips, song recommendations
   - User-generated content
   - Community building

PARTNERSHIPS:
1. Karaoke bars/lounges
   - Offer business tier discount
   - Co-marketing opportunities
   - Case studies

2. Event planners
   - Affiliate program
   - Commission on signups

3. YouTube creators
   - Karaoke channels
   - Music reaction channels

VIRAL FEATURES:
1. Share functionality:
   - "I sang X at karaoke!" social share
   - Leaderboard (most songs sung)
   - Achievements/badges

2. Referral program:
   - Give 1 month free, get 1 month free
   - Track with referral codes

3. Public rooms:
   - Allow users to create public rooms
   - Discover trending public sessions

PAID ADVERTISING (if budget allows):
- Google Ads (keywords: karaoke app, YouTube karaoke)
- Facebook/Instagram Ads
- Reddit Ads (r/karaoke)

Track all channels with UTM parameters.
```

**Acceptance Criteria:**
- [ ] Content calendar created
- [ ] Social media active
- [ ] Partnerships explored
- [ ] Growth metrics tracked

---

## 🔄 PHASE 18: ITERATION & SCALING

### ✅ Task 18.1: Feature Prioritization

**Prompt for Cursor:**
```
Based on user feedback, prioritize next features:

HIGH-IMPACT, LOW-EFFORT (do first):
- [ ] Song history (recently played)
- [ ] Queue shuffle
- [ ] Queue export (save current queue as playlist)
- [ ] Dark/light mode preference persistence
- [ ] Keyboard shortcuts guide

HIGH-IMPACT, HIGH-EFFORT (plan carefully):
- [ ] AI vocal removal (Spleeter integration)
- [ ] Lyrics sync/display
- [ ] Duet mode (two microphones)
- [ ] Recording feature (save performances)
- [ ] Leaderboard/scoring system

LOW-IMPACT, LOW-EFFORT (nice-to-haves):
- [ ] Custom room themes
- [ ] Avatar customization
- [ ] Song tags/genres
- [ ] Favorite songs list

LOW-IMPACT, HIGH-EFFORT (avoid for now):
- [ ] Native mobile apps
- [ ] Video effects/filters
- [ ] Karaoke competitions

Use a prioritization framework:
- RICE score (Reach × Impact × Confidence / Effort)
- Update roadmap quarterly

Create a public roadmap to share with users.
```

**Acceptance Criteria:**
- [ ] Features prioritized
- [ ] Roadmap documented
- [ ] Timeline estimated
- [ ] Resources allocated

---

### ✅ Task 18.2: Scaling Infrastructure

**Prompt for Cursor:**
```
Prepare for scale (1000+ concurrent users):

DATABASE:
- [ ] Upgrade Supabase plan if needed
- [ ] Optimize most common queries
- [ ] Add database replicas (read scaling)
- [ ] Implement caching layer (Redis)
- [ ] Archive old room data (>30 days)

API:
- [ ] Rate limiting per user/IP
- [ ] API versioning (/api/v1)
- [ ] Request throttling
- [ ] Implement CDN (Cloudflare)
- [ ] Optimize API response size

REAL-TIME:
- [ ] Monitor connection limits
- [ ] Implement connection pooling
- [ ] Reduce update frequency if needed
- [ ] Handle reconnection gracefully

MEDIA:
- [ ] Implement image CDN
- [ ] Optimize thumbnail sizes
- [ ] Lazy load everything below fold
- [ ] Implement adaptive quality

COSTS:
- [ ] Monitor Supabase usage
- [ ] Monitor Vercel bandwidth
- [ ] Monitor YouTube API quota
- [ ] Optimize to reduce costs

Create a scaling plan for 10x growth.
```

**Acceptance Criteria:**
- [ ] Infrastructure can handle 10x load
- [ ] Costs remain sustainable
- [ ] Response times <2s at scale
- [ ] No downtime

---

### ✅ Task 18.3: Team & Processes

**Prompt for Cursor:**
```
As the project grows, establish processes:

CODE:
- [ ] Code review process (if team grows)
- [ ] Coding standards document
- [ ] Git workflow (main, develop, feature branches)
- [ ] Automated testing in CI/CD
- [ ] Deployment approval process

DESIGN:
- [ ] Design system documentation
- [ ] Component library (Storybook)
- [ ] Design review process
- [ ] Accessibility guidelines

SUPPORT:
- [ ] Support ticket system
- [ ] Response time SLAs
- [ ] Escalation process
- [ ] Knowledge base/FAQ

PRODUCT:
- [ ] Sprint planning (if using Agile)
- [ ] Feature spec template
- [ ] User story format
- [ ] Acceptance criteria checklist

DOCUMENTATION:
- [ ] README.md (for developers)
- [ ] CONTRIBUTING.md (if open source)
- [ ] API documentation
- [ ] User documentation/help center

Use tools: Linear, GitHub Projects, Notion, Confluence.
```

**Acceptance Criteria:**
- [ ] Processes documented
- [ ] Team aligned
- [ ] Tools in place
- [ ] Onboarding smooth

---

## 🎉 SUCCESS METRICS

**After 1 Month:**
- [ ] 100+ rooms created
- [ ] 500+ songs added to queues
- [ ] 50+ returning users (7-day retention)
- [ ] <2% error rate
- [ ] 90+ Lighthouse score

**After 3 Months:**
- [ ] 1,000+ rooms created
- [ ] 10+ paying customers
- [ ] 70% 7-day retention
- [ ] 30% 30-day retention
- [ ] $500+ MRR

**After 6 Months:**
- [ ] 5,000+ rooms created
- [ ] 100+ paying customers
- [ ] 50% 30-day retention
- [ ] $5,000+ MRR
- [ ] Profitability or clear path to it

**After 12 Months:**
- [ ] 20,000+ rooms created
- [ ] 500+ paying customers
- [ ] 60+ NPS score
- [ ] $25,000+ MRR
- [ ] Series A raise or profitable

---

## 🆘 TROUBLESHOOTING GUIDE

### Common Issues:

**Issue: Real-time not updating**
```
Check:
- Supabase real-time enabled on table
- RLS policies allow reads
- Subscription filter correct
- Client subscribed before data changed
- Network inspector shows websocket connection
```

**Issue: YouTube API quota exceeded**
```
Solutions:
- Implement request caching (1 hour TTL)
- Add rate limiting (10 req/min)
- Use multiple API keys (rotate)
- Upgrade to paid quota
```

**Issue: Supabase RLS blocking reads**
```
Check:
- User authenticated correctly
- Policy allows user's role
- Test query in SQL editor with auth.uid()
- Check policy with EXPLAIN
```

**Issue: Player not loading YouTube video**
```
Check:
- YouTube IFrame API script loaded
- Video ID valid
- CORS settings correct
- Player container has dimensions
- No ad blockers interfering
```

**Issue: Queue reordering not persisting**
```
Check:
- Supabase update mutation succeeding
- Position values calculated correctly
- Real-time broadcasting updates
- Optimistic update rolled back on error
```

---

## 📚 HELPFUL RESOURCES

### Documentation:
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Supabase**: https://supabase.com/docs
- **TanStack Query**: https://tanstack.com/query/latest
- **Zustand**: https://docs.pmnd.rs/zustand
- **YouTube API**: https://developers.google.com/youtube/v3
- **Stripe**: https://stripe.com/docs

### Community:
- **Discord**: Supabase, React, Tailwind communities
- **Reddit**: r/reactjs, r/webdev, r/supabase
- **Stack Overflow**: Tag questions appropriately
- **GitHub Discussions**: For package-specific issues

### Learning:
- **YouTube**: Web Dev Simplified, Fireship, Traversy Media
- **Courses**: Udemy, Frontend Masters, Egghead
- **Blogs**: Josh Comeau, Kent C. Dodds, Dan Abramov

---

## 🎯 CURSOR WORKFLOW TIPS

### Starting a New Feature:
```
"Let's implement [feature name]. First, break down:
1. Components needed
2. State management approach  
3. Supabase schema changes (if any)
4. API integrations
5. Potential edge cases

Then show me the implementation plan before we code."
```

### When Stuck:
```
"I'm stuck on [specific problem]. Here's what I've tried:
[paste code/attempts]

Debug this by:
1. Explaining why it's not working
2. Showing 3 different solutions
3. Recommending the best approach with code"
```

### Code Review:
```
"Review this code for:
- Performance issues
- Security vulnerabilities
- Accessibility problems
- Better patterns or best practices
- TypeScript type safety

[paste code]"
```

### Refactoring:
```
"Refactor this to be:
- More maintainable
- Better performance
- Easier to test
- Follow React/TypeScript best practices

[paste code]

Show me the refactored version with explanations."
```

### Documentation:
```
"Generate documentation for [component/function]:
- Purpose and use cases
- Props/parameters with types
- Return values
- Usage examples
- Edge cases to watch for

[paste code]"
```

---

## ✅ DEFINITION OF DONE

For each task to be considered "done":

**Code Quality:**
- [ ] TypeScript strict mode passing
- [ ] No console errors or warnings
- [ ] No ESLint errors
- [ ] Code formatted with Prettier
- [ ] Comments on complex logic
- [ ] Reusable components extracted

**Functionality:**
- [ ] Feature works as specified
- [ ] Edge cases handled
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Success feedback given

**UX/UI:**
- [ ] Responsive on all screen sizes
- [ ] Accessible (keyboard + screen reader)
- [ ] Animations smooth (60fps)
- [ ] Visual polish applied
- [ ] Matches design system

**Testing:**
- [ ] Manually tested
- [ ] Unit tests written (for critical logic)
- [ ] Integration tested
- [ ] Cross-browser tested

**Performance:**
- [ ] No unnecessary re-renders
- [ ] Lazy loading applied where needed
- [ ] Images optimized
- [ ] Bundle size impact minimal

**Documentation:**
- [ ] Code commented where needed
- [ ] README updated (if applicable)
- [ ] Changelog updated

**Deployment:**
- [ ] Merged to main branch
- [ ] Deployed to production
- [ ] Smoke tested in production
- [ ] No regressions detected

---

## 🚀 QUICK START COMMAND

**Copy this into Cursor to begin:**

```
Read KARAOKE_TODO.md completely.

We're building a YouTube-based karaoke system with:
- React 18.3+ + Vite 5.4+ + TypeScript 5.7+
- Supabase for backend (database + auth + realtime)
- YouTube API for video search
- Real-time queue synchronization
- Mobile controller + TV display mode
- Subscription monetization with Stripe

Start with Phase 1, Task 1.1: Initialize the project with:
- Vite + React + TypeScript
- Tailwind CSS 4
- shadcn/ui
- All dependencies from the tech stack section

Use the latest stable versions of all packages.
Set up the folder structure as specified.
Create .env.local with placeholder values.

After setup, run the dev server and confirm everything works.
```

---

## 📝 PHASE COMPLETION CHECKLIST

Mark phases as complete:

- [ ] **Phase 1**: Project Initialization
- [ ] **Phase 2**: Database Schema
- [ ] **Phase 3**: Core UI Components
- [ ] **Phase 4**: Room Management
- [ ] **Phase 5**: Search & Queue System
- [ ] **Phase 6**: Video Player
- [ ] **Phase 7**: Mobile Controller
- [ ] **Phase 8**: Authentication
- [ ] **Phase 9**: Playlists
- [ ] **Phase 10**: Advanced Player Features
- [ ] **Phase 11**: Business Dashboard
- [ ] **Phase 12**: Monetization
- [ ] **Phase 13**: Testing & Optimization
- [ ] **Phase 14**: PWA & Mobile
- [ ] **Phase 15**: Deployment
- [ ] **Phase 16**: Polish & Launch
- [ ] **Phase 17**: Post-Launch
- [ ] **Phase 18**: Iteration & Scaling

---

## 🎊 FINAL NOTES

**Remember:**
- Start simple, iterate based on feedback
- Test with real users early and often
- Focus on core experience first
- Performance matters more than features
- Good UX beats more features
- Listen to your users
- Celebrate small wins
- Ship often, improve continuously

**When in doubt, ask Cursor:**
"What's the simplest way to implement this that I can improve later?"

---

## 📧 SUPPORT

If you get truly stuck or need help:
1. Re-read the relevant phase in this document
2. Ask Cursor with specific context
3. Check official documentation
4. Search GitHub issues
5. Ask in community forums
6. Consider hiring a consultant for complex issues

---

## 🎤 LET'S BUILD THIS!

You now have everything you need to build a professional YouTube karaoke platform.

**Next step:** Open Cursor and paste the Quick Start Command above.

Good luck, and have fun building! 🚀🎵