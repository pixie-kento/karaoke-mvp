# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-01-07

### Added
- Initial MVP release
- Room creation and joining with unique 6-character codes
- YouTube karaoke video search and filtering
- Real-time synchronized queue management
- Video player with YouTube IFrame API
- TV Mode for full-screen karaoke display
- Mobile controller interface with tabs (Now Playing, Search, Queue, My Songs)
- QR code generation for easy room sharing
- User authentication (email/password, Google OAuth, anonymous)
- Playlist management (create, edit, delete, add songs)
- Add entire playlists to queue
- Advanced player controls (volume, key adjustment UI, vocal removal UI)
- Layout system with header and footer
- Responsive design for mobile, tablet, and desktop

### Technical
- React 18 + TypeScript + Vite
- Supabase for backend, database, auth, and real-time
- TanStack Query for server state management
- Zustand for client state management
- Tailwind CSS + shadcn/ui for styling
- Sonner for toast notifications
- React Router for navigation

### Known Limitations
- Key adjustment and vocal removal require audio stream processing (UI ready, backend processing needed)
- YouTube IFrame API doesn't provide direct audio stream access
- Real-time updates depend on Supabase connection quality

