import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email?: string
  displayName?: string
  avatarUrl?: string
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) {
    return { user: null, error: error.message }
  }

  // Create user record in public.users table
  if (data.user) {
    const { error: dbError } = await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email,
      display_name: displayName,
    })

    if (dbError) {
      console.error('Error creating user record:', dbError)
    }
  }

  return { user: data.user, error: null }
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, error: error.message }
  }

  return { user: data.user, error: null }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Sign out
 */
export async function signOut(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Update user profile
 */
export async function updateProfile(
  displayName?: string,
  avatarUrl?: string
): Promise<{ error: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No user logged in' }
  }

  const updates: { display_name?: string; avatar_url?: string } = {}
  if (displayName) updates.display_name = displayName
  if (avatarUrl) updates.avatar_url = avatarUrl

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Reset password
 */
export async function resetPassword(
  email: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Generate anonymous display name
 */
export function generateAnonymousName(): string {
  const adjectives = [
    'Cool',
    'Awesome',
    'Epic',
    'Super',
    'Mega',
    'Ultra',
    'Pro',
    'Elite',
  ]
  const nouns = [
    'Singer',
    'Star',
    'Legend',
    'Hero',
    'Champ',
    'Master',
    'Pro',
    'Guru',
  ]
  const randomNum = Math.floor(Math.random() * 1000)
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adjective}${noun}${randomNum}`
}

