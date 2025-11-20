<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Logo/Header -->
        <div class="auth-header">
          <h1 class="auth-title">Welcome Back</h1>
          <p class="auth-subtitle">Sign in to manage your budget</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert--error">
          <span class="material-symbols-rounded alert-icon">error</span>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="alert alert--success">
          <span class="material-symbols-rounded alert-icon">check_circle</span>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSignIn" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="your@email.com"
              class="form-input"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="form-input"
              :disabled="loading"
            />
          </div>

          <div class="form-footer">
            <NuxtLink to="/forgot-password" class="link-secondary">
              Forgot password?
            </NuxtLink>
          </div>

          <button
            type="submit"
            class="btn btn--primary btn--block"
            :disabled="loading"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else class="btn-loading">
              <span class="spinner"></span>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Sign Up Link -->
        <div class="auth-footer">
          <p class="auth-footer-text">
            Don't have an account?
            <NuxtLink to="/signup" class="link-primary">Sign up</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { signIn, loading, error } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleSignIn = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  const { user, error: signInError } = await signIn(email.value, password.value)

  if (signInError) {
    errorMessage.value = signInError.message || 'Failed to sign in'
    return
  }

  if (user) {
    successMessage.value = 'Successfully signed in!'
    // Redirect to home page after successful login
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }
}

// Clear error when user starts typing
watch([email, password], () => {
  errorMessage.value = ''
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-secondary-light) 100%);
  padding: var(--spacing-lg);
}

.auth-container {
  width: 100%;
  max-width: 440px;
}

.auth-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.auth-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs);
}

.auth-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
}

.alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-sm);
}

.alert--error {
  background-color: rgba(239, 71, 111, 0.1);
  color: var(--color-accent);
  border: 1px solid rgba(239, 71, 111, 0.3);
}

.alert--success {
  background-color: rgba(62, 207, 142, 0.1);
  color: var(--color-primary);
  border: 1px solid rgba(62, 207, 142, 0.3);
}

.alert-icon {
  font-size: var(--icon-md);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.form-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  background-color: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(62, 207, 142, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--color-surface);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: calc(var(--spacing-xs) * -1);
}

.link-secondary {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.link-secondary:hover {
  color: var(--color-primary);
}

.btn {
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.btn--primary {
  background-color: var(--color-primary);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn--primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn--block {
  width: 100%;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-footer {
  margin-top: var(--spacing-xl);
  text-align: center;
}

.auth-footer-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.link-primary {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  transition: color var(--transition-fast);
}

.link-primary:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-page {
    padding: var(--spacing-md);
  }

  .auth-card {
    padding: var(--spacing-xl);
  }

  .auth-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
