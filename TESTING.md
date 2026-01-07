# 🧪 Local Testing Guide

This guide will help you test the Karaoke MVP locally before deploying.

## 📋 Prerequisites

1. **Node.js** (v18+ recommended)
2. **npm** or **yarn**
3. **Supabase Account** (free tier works)
4. **YouTube Data API Key** (free tier works)

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.production.example .env.local
```

Then edit `.env.local` with your actual values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_YOUTUBE_API_KEY=your-youtube-api-key-here
```

**Where to get these values:**

1. **Supabase URL & Key:**
   - Go to https://supabase.com
   - Create a new project (or use existing)
   - Go to **Settings > API**
   - Copy **Project URL** → `VITE_SUPABASE_URL`
   - Copy **anon/public key** → `VITE_SUPABASE_ANON_KEY`

2. **YouTube API Key:**
   - Go to https://console.cloud.google.com
   - Create a new project (or select existing)
   - Enable **YouTube Data API v3**
   - Go to **Credentials > Create Credentials > API Key**
   - Copy the API key → `VITE_YOUTUBE_API_KEY`
   - (Optional) Restrict the key to YouTube Data API v3 only

### Step 3: Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open `supabase/migrations/001_initial_schema.sql`
4. Copy the entire SQL content
5. Paste into SQL Editor and click **Run**
6. Verify tables are created:
   - `users`
   - `rooms`
   - `queue_items`
   - `playlists`
   - `playlist_songs`

### Step 4: Start Development Server

```bash
npm run dev
```

The app should start at: **http://localhost:5173**

---

## ✅ Testing Checklist

### 1. Home Page
- [ ] Home page loads without errors
- [ ] "Create Room" button works
- [ ] "Join Room" button works
- [ ] Navigation links work

### 2. Room Creation
- [ ] Click "Create Room"
- [ ] Enter room name
- [ ] Select room type (home/business)
- [ ] Room code is generated (6 characters, uppercase)
- [ ] Redirected to `/room/:code`
- [ ] Room code displays correctly

### 3. Room Joining
- [ ] Open a new browser tab/incognito window
- [ ] Click "Join Room"
- [ ] Enter the room code from step 2
- [ ] Successfully joins room
- [ ] Can see the room interface

### 4. YouTube Search
- [ ] Search bar appears in room
- [ ] Type a song name (e.g., "Bohemian Rhapsody karaoke")
- [ ] Results appear after debounce (500ms)
- [ ] Results show thumbnails, titles, channel names
- [ ] Only karaoke videos appear (filtered)

### 5. Queue Management
- [ ] Click "Add to Queue" on a search result
- [ ] Song appears in queue immediately
- [ ] Toast notification shows success
- [ ] Add multiple songs
- [ ] Queue updates in real-time (test in 2 browser windows)
- [ ] Remove button works (host or song adder)
- [ ] Drag-and-drop reordering works (host only)

### 6. Video Player
- [ ] First song in queue auto-plays
- [ ] Video loads and plays
- [ ] Player controls appear (for host)
- [ ] Play/pause button works
- [ ] Skip button works
- [ ] Volume slider works
- [ ] Next song auto-plays when current ends

### 7. TV Mode
- [ ] Click "TV Mode" link in room
- [ ] Navigate to `/tv/:code`
- [ ] Full-screen video player displays
- [ ] Current song info shows
- [ ] Up next preview shows
- [ ] QR code displays (if implemented)
- [ ] Queue syncs in real-time

### 8. Mobile Controller
- [ ] Click "Controller" link in room
- [ ] Navigate to `/controller/:code`
- [ ] Tabs work: Search, Queue, Now Playing, My Songs
- [ ] Search works in controller
- [ ] Queue displays correctly
- [ ] Now Playing shows current song
- [ ] My Songs filters correctly
- [ ] Host controls appear (if host)
- [ ] Guest view shows info only (if guest)

### 9. Authentication
- [ ] Click "Sign In" in header
- [ ] Auth dialog opens
- [ ] Can switch between Sign In / Sign Up tabs
- [ ] Email/password sign up works
- [ ] Email/password sign in works
- [ ] Google OAuth button appears (if configured)
- [ ] Sign out works
- [ ] User menu shows when authenticated
- [ ] Anonymous users can still use app

### 10. Playlists (Requires Auth)
- [ ] Sign in first
- [ ] Navigate to `/playlists`
- [ ] "Create Playlist" button works
- [ ] Can create new playlist
- [ ] Playlist appears in grid
- [ ] Click playlist to view details
- [ ] Can add songs to playlist (YouTube search)
- [ ] Can remove songs from playlist
- [ ] Can delete playlist
- [ ] "Add All to Queue" button works

### 11. QR Code
- [ ] QR code displays in room or TV mode
- [ ] QR code is scannable
- [ ] Scanning QR code opens room join page
- [ ] Room code is correct in QR

### 12. Real-Time Sync
- [ ] Open room in 2 browser windows
- [ ] Add song in window 1
- [ ] Song appears in window 2 (<500ms delay)
- [ ] Remove song in window 1
- [ ] Song disappears in window 2
- [ ] Reorder queue in window 1 (host)
- [ ] Order updates in window 2

### 13. Error Handling
- [ ] Invalid room code shows error
- [ ] Network error shows retry option
- [ ] YouTube API error shows message
- [ ] Supabase connection error handled
- [ ] No crashes on errors

### 14. Responsive Design
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop (1920px)
- [ ] All layouts work correctly
- [ ] Touch interactions work on mobile

---

## 🐛 Common Issues & Solutions

### Issue: "Supabase client initialization failed"
**Solution:**
- Check `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after changing env vars
- Verify Supabase project is active

### Issue: "YouTube API quota exceeded"
**Solution:**
- Check API quota in Google Cloud Console
- Wait for quota reset (daily limit)
- Use multiple API keys (rotate)
- Clear cache and try again

### Issue: "Real-time not updating"
**Solution:**
- Verify real-time is enabled in Supabase dashboard
- Check RLS policies allow reads
- Check browser console for WebSocket errors
- Verify subscription is active

### Issue: "Room code already exists"
**Solution:**
- This is rare but can happen
- The code should auto-retry with new code
- If persistent, check database for duplicate codes

### Issue: "Video player not loading"
**Solution:**
- Check browser console for YouTube API errors
- Verify YouTube IFrame API script loads
- Check if ad blockers are interfering
- Try different browser

### Issue: "Build errors"
**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
npm run typecheck

# Check linting
npm run lint
```

---

## 🔍 Debugging Tips

### 1. Check Browser Console
- Open DevTools (F12)
- Look for errors in Console tab
- Check Network tab for failed requests

### 2. Check Supabase Dashboard
- Go to **Database > Tables** - verify tables exist
- Go to **Database > Replication** - verify real-time enabled
- Go to **Authentication > Users** - check user creation
- Go to **Logs** - check for errors

### 3. Check Environment Variables
```bash
# In browser console, these should NOT be undefined:
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
console.log(import.meta.env.VITE_YOUTUBE_API_KEY)
```

### 4. Test Database Connection
```bash
# In browser console:
import { supabase } from './lib/supabase'
const { data, error } = await supabase.from('rooms').select('*').limit(1)
console.log('DB Test:', { data, error })
```

### 5. Test YouTube API
```bash
# In browser console:
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const response = await fetch(
  `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test+karaoke&key=${API_KEY}`
)
const data = await response.json()
console.log('YouTube Test:', data)
```

---

## 🎯 Testing Scenarios

### Scenario 1: Home Party
1. Host creates room
2. 3 guests join via room code
3. Each guest adds 2 songs
4. Host reorders queue
5. Songs play automatically
6. Everyone sees real-time updates

### Scenario 2: Playlist Management
1. User signs up
2. Creates 2 playlists
3. Adds songs to each playlist
4. Adds entire playlist to queue
5. Deletes one playlist
6. Updates playlist name

### Scenario 3: Mobile Controller
1. Open room on desktop (TV mode)
2. Open same room on mobile (controller)
3. Add songs from mobile
4. Control playback from mobile (if host)
5. See real-time sync between devices

### Scenario 4: Error Recovery
1. Disconnect internet
2. Try to add song (should show error)
3. Reconnect internet
4. Retry adding song (should work)
5. Verify queue syncs

---

## 📊 Performance Testing

### Check Load Times
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Search results: < 1s
- Real-time updates: < 500ms

### Check Bundle Size
```bash
npm run build
# Check dist/ folder size
# Should be < 1MB total
```

### Lighthouse Audit
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Target scores:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 100
   - SEO: 100

---

## 🚀 Ready for Production?

Before deploying, ensure:
- [ ] All tests pass locally
- [ ] No console errors
- [ ] Environment variables set in Vercel
- [ ] Database migration run in production Supabase
- [ ] YouTube API key configured
- [ ] Build succeeds: `npm run build`
- [ ] TypeScript compiles: `npm run typecheck`

---

## 📝 Test Report Template

After testing, document:

```
Date: [Date]
Tester: [Your Name]
Environment: Local Development

✅ Working:
- [List working features]

❌ Issues Found:
- [List issues with steps to reproduce]

🔧 Fixes Needed:
- [List required fixes]

📊 Performance:
- Load time: [X]s
- Real-time delay: [X]ms
- Bundle size: [X]KB

Overall Status: [ ] Ready / [ ] Needs Fixes
```

---

## 🎉 Happy Testing!

If you encounter any issues not covered here, check:
1. `DEPLOYMENT.md` for deployment-specific issues
2. `PROJECT_STATUS.md` for known limitations
3. Browser console for error messages
4. Supabase logs for backend errors

Good luck! 🎤

