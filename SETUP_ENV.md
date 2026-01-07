# 🔧 Environment Variables Setup Guide

## ⚠️ Important: Two Different Connection Methods

Your app uses **Supabase Client** (not direct PostgreSQL), so you need different values than the PostgreSQL connection string.

---

## 📝 For Frontend App (.env.local)

The frontend app needs these **3 environment variables**:

```env
VITE_SUPABASE_URL=https://fbuxznkzvoinyaqwwlec.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_YOUTUBE_API_KEY=your-youtube-api-key-here
```

### Where to Get These Values:

#### 1. Supabase URL & Anon Key

1. Go to: https://supabase.com/dashboard/project/fbuxznkzvoinyaqwwlec
2. Navigate to: **Settings** → **API**
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
     - Should look like: `https://fbuxznkzvoinyaqwwlec.supabase.co`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
     - This is a long JWT token starting with `eyJ...`

#### 2. YouTube API Key

1. Go to: https://console.cloud.google.com
2. Create/select a project
3. Enable **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the key → `VITE_YOUTUBE_API_KEY`

---

## 🗄️ PostgreSQL Connection String (For Database Tools Only)

The connection string you have:
```
postgresql://postgres:[YOUR-PASSWORD]@db.fbuxznkzvoinyaqwwlec.supabase.co:5432/postgres
```

**This is ONLY for:**
- Database management tools (pgAdmin, DBeaver, etc.)
- Direct SQL access
- Backend services that connect directly to PostgreSQL

**NOT for the frontend app!**

To get the password:
1. Go to Supabase Dashboard
2. **Settings** → **Database**
3. Find **Connection string** section
4. Copy the password (or reset it if needed)

---

## ✅ Quick Setup Steps

### Step 1: Create .env.local file

In the root of your project, create `.env.local`:

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Or just create it manually in your editor
```

### Step 2: Add your values

Open `.env.local` and add:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://fbuxznkzvoinyaqwwlec.supabase.co
VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here

# YouTube API
VITE_YOUTUBE_API_KEY=paste-your-youtube-key-here
```

### Step 3: Restart dev server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🔍 Verify Your Setup

### Check in Browser Console

Open your app and in browser console (F12), run:

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
console.log('YouTube Key:', import.meta.env.VITE_YOUTUBE_API_KEY ? '✅ Set' : '❌ Missing')
```

### Test Supabase Connection

In browser console:

```javascript
import { supabase } from './lib/supabase'
const { data, error } = await supabase.from('rooms').select('*').limit(1)
console.log('Connection test:', error ? '❌ Failed' : '✅ Success', { data, error })
```

---

## 🚨 Common Mistakes

### ❌ Wrong: Using PostgreSQL connection string
```env
# DON'T DO THIS!
VITE_SUPABASE_URL=postgresql://postgres:password@db.fbuxznkzvoinyaqwwlec.supabase.co:5432/postgres
```

### ✅ Correct: Using Supabase HTTPS URL
```env
# DO THIS!
VITE_SUPABASE_URL=https://fbuxznkzvoinyaqwwlec.supabase.co
```

### ❌ Wrong: Using service_role key
```env
# DON'T USE SERVICE ROLE IN FRONTEND!
VITE_SUPABASE_ANON_KEY=service_role_key_here  # ❌ SECURITY RISK!
```

### ✅ Correct: Using anon/public key
```env
# USE ANON KEY (it's safe for frontend)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # ✅ Safe
```

---

## 📋 Complete .env.local Template

```env
# ============================================
# Supabase Configuration
# Get from: https://supabase.com/dashboard/project/[project-id]/settings/api
# ============================================
VITE_SUPABASE_URL=https://fbuxznkzvoinyaqwwlec.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidXh6bmt6dm9pbnlhcXd3bGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU3NjAwMH0.your-actual-key-here

# ============================================
# YouTube Data API v3
# Get from: https://console.cloud.google.com/apis/credentials
# ============================================
VITE_YOUTUBE_API_KEY=AIzaSyYourActualYouTubeAPIKeyHere

# ============================================
# Note: Never commit this file to git!
# It's already in .gitignore
# ============================================
```

---

## 🔐 Security Notes

1. ✅ **Anon key is safe** for frontend - it's public by design
2. ❌ **Never expose service_role key** - it bypasses RLS
3. ✅ **.env.local is gitignored** - your secrets are safe
4. ✅ **Use different keys** for development and production

---

## 🆘 Still Having Issues?

1. **Check file name**: Must be exactly `.env.local` (not `.env`, `.env.local.txt`, etc.)
2. **Check location**: Must be in project root (same folder as `package.json`)
3. **Restart server**: Environment variables only load on server start
4. **Check spelling**: Variable names are case-sensitive
5. **Check prefix**: Must start with `VITE_` for Vite to expose them

---

## 📚 Additional Resources

- Supabase Docs: https://supabase.com/docs/guides/getting-started
- Vite Env Variables: https://vitejs.dev/guide/env-and-mode.html
- YouTube API Setup: https://developers.google.com/youtube/v3/getting-started

