# 🚨 QUICK FIX: App Not Starting

## ✅ Good News: Server IS Running!

The dev server is running on **http://localhost:5173**

## ❌ The Problem: Invalid Supabase Key

Your Supabase key format is incorrect:
```
sb_publishable_P_HaaX0TKvJhR5KzteqYFw_DH8_dPpt
```

This is **NOT** a valid Supabase anon key. Supabase anon keys are JWT tokens.

---

## 🔧 Fix It Now (2 Steps)

### Step 1: Get the Correct Anon Key

1. Go to: **https://supabase.com/dashboard/project/fbuxznkzvoinyaqwwlec/settings/api**
2. Scroll to **"Project API keys"** section
3. Find **"anon public"** key (NOT "service_role")
4. Copy the **ENTIRE** JWT token
   - It's very long (200+ characters)
   - Starts with `eyJhbGciOiJIUzI1NiIs...`
   - Looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidXh6bmt6dm9pbnlhcXd3bGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU3NjAwMH0.xxxxx`

### Step 2: Update .env.local

Open `.env.local` and replace the key:

```env
VITE_SUPABASE_URL=https://fbuxznkzvoinyaqwwlec.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...paste-full-jwt-here
VITE_YOUTUBE_API_KEY=AIzaSyDTraCh2jdpa5pZqdlDzgzoKvETBXOr8J8
```

### Step 3: Restart Server

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

---

## 🧪 Test It

1. Open: **http://localhost:5173**
2. Open browser console (F12)
3. Check for errors
4. Should see app loading (not blank page)

---

## 📸 Where to Find the Key

In Supabase Dashboard:
- **Settings** → **API** → **Project API keys**
- Look for **"anon"** or **"anon public"**
- Copy the entire value (it's long!)

**DO NOT use:**
- ❌ service_role key (security risk!)
- ❌ Short keys like `sb_publishable_...`
- ❌ Connection strings

**USE:**
- ✅ anon public key (JWT token, starts with `eyJ`)

---

## 🆘 Still Not Working?

1. **Check browser console** (F12) for exact error
2. **Verify key format** - must be JWT token
3. **Restart server** after updating .env.local
4. **Clear browser cache** (Ctrl+Shift+R)

The server is running - the issue is the Supabase key format!

