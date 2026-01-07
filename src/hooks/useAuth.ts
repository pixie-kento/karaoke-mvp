import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import {
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  getCurrentUser,
  updateProfile,
  resetPassword,
} from '@/lib/auth'

export function useAuth() {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['auth-user'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  useEffect(() => {
    setUser(currentUser || null)
    setIsLoading(false)

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [currentUser, queryClient])

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: ({
      email,
      password,
      displayName,
    }: {
      email: string
      password: string
      displayName: string
    }) => signUp(email, password, displayName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
    },
  })

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
    },
  })

  // Sign in with Google mutation
  const signInWithGoogleMutation = useMutation({
    mutationFn: signInWithGoogle,
  })

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
      setUser(null)
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: ({
      displayName,
      avatarUrl,
    }: {
      displayName?: string
      avatarUrl?: string
    }) => updateProfile(displayName, avatarUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
    },
  })

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp: signUpMutation.mutateAsync,
    signIn: signInMutation.mutateAsync,
    signInWithGoogle: signInWithGoogleMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
  }
}

