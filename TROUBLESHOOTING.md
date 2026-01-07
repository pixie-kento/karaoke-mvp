# 🔧 Troubleshooting: App Not Starting

## Common Issues & Solutions

### Issue 1: Missing Environment Variables

**Error:** `Missing Supabase environment variables`

**Solution:**
1. Check `.env.local` exists in project root
2. Verify it contains:
   ```env
   VITE_SUPABASE_URL=https://fbuxznkzvoinyaqwwlec.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key-here
   VITE_YOUTUBE_API_KEY=your-key-here
   ```
3. **Restart dev server** after adding/updating `.env.local`

---

### Issue 2: Invalid Supabase Key Format

**Error:** Supabase connection fails or authentication errors

**Problem:** The key `sb_publishable_P_HaaX0TKvJhR5KzteqYFw_DH8_dPpt` is not a valid Supabase anon key.

**Solution:**
1. Go to: https://supabase.com/dashboard/project/fbuxznkzvoinyaqwwlec/settings/api
2. Find **"anon public"** key (NOT service_role)
3. Copy the **entire JWT token** (starts with `eyJ...`, very long)
4. Update `.env.local` with the correct key
5. Restart dev server

**Correct format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidXh6bmt6dm9pbnlhcXd3bGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU3NjAwMH0.xxxxx
```

---

### Issue 3: Port Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Option 1: Kill process on port 5173
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Option 2: Use different port
# Edit vite.config.ts and change port number
```

---

### Issue 4: TypeScript Errors

**Error:** TypeScript compilation fails

**Solution:**
```bash
# Check for TypeScript errors
npm run typecheck

# Fix any errors shown
# Common fixes:
# - Missing imports
# - Type mismatches
# - Missing type definitions
```

---

### Issue 5: Missing Dependencies

**Error:** `Cannot find module 'xxx'`

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or on Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

---

### Issue 6: Browser Console Errors

**Check browser console (F12) for:**
- Supabase connection errors
- Missing environment variables
- Network errors
- React errors

**Common fixes:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check environment variables are loaded:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```

---

## 🔍 Diagnostic Steps

### Step 1: Check Environment Variables
```bash
# Windows PowerShell
Get-Content .env.local

# Should show:
# VITE_SUPABASE_URL=https://...
# VITE_SUPABASE_ANON_KEY=eyJ...
# VITE_YOUTUBE_API_KEY=AIza...
```

### Step 2: Verify TypeScript
```bash
npm run typecheck
# Should complete with no errors
```

### Step 3: Check Dependencies
```bash
npm list --depth=0
# Should show all packages installed
```

### Step 4: Try Starting Server
```bash
npm run dev
# Should start on http://localhost:5173
```

### Step 5: Check Browser Console
1. Open http://localhost:5173
2. Press F12 (DevTools)
3. Check Console tab for errors
4. Check Network tab for failed requests

---

## ✅ Quick Fix Checklist

- [ ] `.env.local` file exists in project root
- [ ] Environment variables are set correctly
- [ ] Supabase anon key is a JWT token (starts with `eyJ`)
- [ ] Dev server restarted after env changes
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] All dependencies installed (`npm install`)
- [ ] Port 5173 is available
- [ ] Browser console checked for errors

---

## 🆘 Still Not Working?

1. **Check the exact error message** in:
   - Terminal output
   - Browser console (F12)
   - Network tab

2. **Verify Supabase setup:**
   - Database migration run successfully?
   - Tables created?
   - RLS policies active?

3. **Test Supabase connection:**
   ```javascript
   // In browser console:
   import { supabase } from './lib/supabase'
   const { data, error } = await supabase.from('rooms').select('*').limit(1)
   console.log({ data, error })
   ```

4. **Check logs:**
   - Supabase Dashboard → Logs
   - Vercel logs (if deployed)
   - Browser DevTools → Network

---

## 📞 Get Help

If still stuck, provide:
1. Exact error message
2. Terminal output
3. Browser console errors
4. Environment variable status (without showing actual keys)

