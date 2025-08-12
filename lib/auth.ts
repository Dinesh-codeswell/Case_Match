import { supabase } from "./supabase"
import type { Profile } from "./supabase"

export interface SignUpData {
  firstName: string
  lastName: string
  email: string
  password: string
  collegeName: string
}

export interface SignInData {
  email: string
  password: string
}

export const signUp = async (data: SignUpData) => {
  try {
    // Sign up the user without email confirmation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: undefined, // No email confirmation
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          college_name: data.collegeName,
          full_access: true,
        },
      },
    })

    if (authError) {
      // If it's a "user already registered" error, return a specific error object
      if (authError.message.includes("already registered") || authError.message.includes("User already registered")) {
        return { user: null, session: null, error: new Error("User already registered. Please sign in.") }
      }
      throw authError // Re-throw other unexpected errors
    }

    // Return the auth data - user will be created but not automatically signed in
    return authData
  } catch (error) {
    console.error("Sign up error:", error)
    throw error
  }
}

export const signIn = async (data: SignInData) => {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      // If login fails, check if it's because the user exists but needs to be activated
      if (error.message.includes("Invalid login credentials")) {
        // Try to sign up the user again to activate their account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        })

        if (signUpError && !signUpError.message.includes("already registered")) {
          throw error // Original login error
        }

        // If sign up succeeded or user already exists, try login again
        const { data: retryAuthData, error: retryError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        if (retryError) {
          throw error // Original login error
        }

        return retryAuthData
      }

      throw error
    }

    return authData
  } catch (error) {
    console.error("Sign in error:", error)
    throw error
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Profile fetch error:", error)
    return null
  }
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  try {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}
