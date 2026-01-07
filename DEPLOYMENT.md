# Deployment Guide

## Prerequisites

1. **Supabase Project** - Set up at https://supabase.com
2. **YouTube Data API Key** - Get from https://console.cloud.google.com
3. **Vercel Account** - Sign up at https://vercel.com
4. **GitHub Repository** - Your code should be in a GitHub repo

## Step 1: Supabase Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. Verify tables are created:
   - `users`
   - `rooms`
   - `queue_items`
   - `playlists`
   - `playlist_songs`
5. Check **Settings > API** for your:
   - Project URL
   - Anon (public) key

## Step 2: YouTube API Setup

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Enable **YouTube Data API v3**
4. Create credentials (API Key)
5. Restrict the key to YouTube Data API v3 only (for security)

## Step 3: Vercel Deployment

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_YOUTUBE_API_KEY=your_youtube_api_key
   ```
6. Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Step 4: Environment Variables

Set these in Vercel Dashboard > Project > Settings > Environment Variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `VITE_YOUTUBE_API_KEY` - Your YouTube Data API key

**Important**: 
- Add these for **Production**, **Preview**, and **Development** environments
- Never commit `.env.local` to git

## Step 5: Custom Domain (Optional)

1. Go to Vercel Dashboard > Project > Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

## Step 6: Post-Deployment Checklist

- [ ] Test room creation
- [ ] Test room joining
- [ ] Test YouTube search
- [ ] Test queue management
- [ ] Test video playback
- [ ] Test authentication (sign up/sign in)
- [ ] Test playlist creation
- [ ] Test on mobile devices
- [ ] Test TV mode on large screen
- [ ] Verify real-time updates work
- [ ] Check error logs in Vercel dashboard

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes: `npm run typecheck`

### Environment Variables Not Working

- Ensure variables start with `VITE_` prefix
- Redeploy after adding/changing variables
- Check variable names match exactly (case-sensitive)

### Real-time Not Working

- Verify Supabase real-time is enabled
- Check RLS policies allow reads
- Verify WebSocket connections aren't blocked

### YouTube API Quota Exceeded

- Check API usage in Google Cloud Console
- Implement caching (already done in code)
- Consider upgrading API quota

## Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider adding Sentry (optional)
3. **Supabase Dashboard**: Monitor database usage and real-time connections

## Production Optimizations

- Enable Vercel Analytics
- Set up error monitoring (Sentry recommended)
- Configure CDN caching
- Monitor API quotas
- Set up database backups in Supabase

