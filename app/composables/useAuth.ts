export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  const signUp = async (email: string, password: string, fullName?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (signUpError) {
        error.value = signUpError.message
        return { user: null, error: signUpError }
      }
      
      return { user: data.user, error: null }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An error occurred during sign up'
      error.value = message
      return { user: null, error: { message } }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) {
        error.value = signInError.message
        return { user: null, error: signInError }
      }
      
      return { user: data.user, error: null }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An error occurred during sign in'
      error.value = message
      return { user: null, error: { message } }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        error.value = signOutError.message
        return { error: signOutError }
      }
      
      // Navigate to login page after sign out
      await navigateTo('/login')
      return { error: null }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An error occurred during sign out'
      error.value = message
      return { error: { message } }
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (resetError) {
        error.value = resetError.message
        return { error: resetError }
      }
      
      return { error: null }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An error occurred during password reset'
      error.value = message
      return { error: { message } }
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (newPassword: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (updateError) {
        error.value = updateError.message
        return { error: updateError }
      }
      
      return { error: null }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An error occurred during password update'
      error.value = message
      return { error: { message } }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading: readonly(loading),
    error: readonly(error),
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  }
}
