// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // SPA mode for static deployment
  ssr: false,
  
  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false,  // Disable type checking during build to avoid path issues
    shim: false
  },
  
  // Vite configuration
  vite: {
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'chart': ['chart.js']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['chart.js']
    }
  },
  
  // App configuration
  app: {
    head: {
      title: 'Monthly Budget Planner',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Track and manage your monthly budget with ease' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // CSS configuration
  css: ['~/assets/css/main.css'],
  
  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      storyblokToken: process.env.NUXT_PUBLIC_STORYBLOK_TOKEN || ''
    }
  },
  
  // Modules (add Storyblok when ready)
  modules: [
    '@pinia/nuxt',
    // '@storyblok/nuxt' // Uncomment when ready to use Storyblok
  ],
  
  // Netlify-specific optimizations
  nitro: {
    preset: 'netlify',
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },
  
  // Build optimizations
  experimental: {
    payloadExtraction: false
  }
})
