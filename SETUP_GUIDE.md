# 🎯 Monthly Budget Planner - Complete Setup Guide

A modern, production-ready **Monthly Budget Planner** built with Nuxt 4, Vue 3 Composition API, TypeScript, and Chart.js. Features tabs navigation, interactive pie charts, and persistent data storage.

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Storyblok Integration](#storyblok-integration)
- [GitHub & CI/CD Setup](#github--cicd-setup)
- [Performance & Best Practices](#performance--best-practices)
- [VS Code Setup](#vs-code-setup)
- [Next Steps](#next-steps)

---

## 🚀 Quick Start

```bash
# Clone this repository (or create from scratch)
git clone <your-repo-url>
cd monthly-budget-tool

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Run development server
pnpm dev

# Open http://localhost:3000
```

---

## 📁 Project Structure

```
monthly-budget-tool/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css              # Global styles with CSS variables
│   ├── components/
│   │   ├── __tests__/                # Component tests
│   │   │   ├── Tabs.spec.ts
│   │   │   └── PieChart.spec.ts
│   │   ├── Tabs.vue                  # Accessible tabs component
│   │   ├── PieChart.vue              # Chart.js pie chart wrapper
│   │   ├── BudgetOverview.vue        # Overview tab content
│   │   ├── ExpensesView.vue          # Expenses management
│   │   ├── IncomeView.vue            # Income management
│   │   └── ReportsView.vue           # Reports & analytics
│   ├── composables/
│   │   └── useBudget.ts              # Budget data composable
│   ├── pages/
│   │   └── index.vue                 # Main application page
│   ├── stores/
│   │   ├── __tests__/
│   │   │   └── budget.spec.ts
│   │   └── budget.ts                 # Pinia store for budget data
│   ├── types/
│   │   └── budget.ts                 # TypeScript interfaces
│   └── app.vue                       # Root component
├── .github/
│   └── workflows/
│       └── ci-cd.yml                 # GitHub Actions workflow
├── .vscode/
│   ├── extensions.json               # Recommended extensions
│   └── settings.json                 # Editor settings
├── public/
│   └── robots.txt
├── .env.example                      # Environment variables template
├── .gitignore
├── .prettierrc                       # Prettier configuration
├── eslint.config.mjs                 # ESLint configuration
├── netlify.toml                      # Netlify deployment config
├── nuxt.config.ts                    # Nuxt configuration
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json                     # TypeScript configuration
├── vitest.config.ts                  # Test configuration
└── README.md
```

---

## 🛠 Technology Stack

### Core Framework
- **Nuxt 4** - Vue meta-framework with SPA mode
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Next-generation build tool

### State Management & Data
- **Pinia** - Vue state management
- **LocalStorage** - Client-side persistence

### UI & Charts
- **Chart.js 4** - Interactive charts library
- **Custom CSS** - CSS variables for theming

### Testing
- **Vitest** - Fast unit test framework
- **Vue Test Utils** - Vue component testing
- **Happy-DOM** - Lightweight DOM for tests

### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

### Deployment & CI/CD
- **Netlify** - Serverless deployment platform
- **GitHub Actions** - CI/CD automation

---

## 💻 Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

```bash
# Install pnpm globally if not installed
npm install -g pnpm

# Verify installation
node --version  # Should be >= 18
pnpm --version  # Should be >= 8
```

### Install Dependencies

```bash
# Install all project dependencies
pnpm install

# This will install:
# - Nuxt 4 & Vue 3
# - Pinia for state management
# - Chart.js for charts
# - TypeScript & type definitions
# - Testing libraries (Vitest, Vue Test Utils)
# - Linting tools (ESLint, Prettier)
```

### Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your values (optional for local dev)
# NUXT_PUBLIC_STORYBLOK_TOKEN=your_token_here
```

---

## 🏗 Development

### Run Development Server

```bash
# Start dev server with hot-reload
pnpm dev

# Server runs at http://localhost:3000
```

### Build for Production

```bash
# Generate static SPA build
pnpm generate

# Output will be in .output/public/
```

### Preview Production Build

```bash
# Build and preview locally
pnpm generate
pnpm preview
```

### Code Quality Commands

```bash
# Run ESLint
pnpm lint

# Fix ESLint issues automatically
pnpm lint:fix

# Format code with Prettier
pnpm format

# TypeScript type checking
pnpm typecheck
```

---

## 🧪 Testing

### Why Vitest?

Vitest is chosen for its:
- **Speed**: Blazing fast with native ES modules
- **Vite integration**: Shares config with build tool
- **Vue 3 support**: First-class Vue component testing
- **Modern API**: Compatible with Jest

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Test Examples

**Component Test** (`components/__tests__/Tabs.spec.ts`):
```typescript
import { mount } from '@vue/test-utils'
import Tabs from '~/components/Tabs.vue'

it('renders all tabs', () => {
  const wrapper = mount(Tabs, {
    props: {
      tabs: [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' }
      ]
    }
  })
  expect(wrapper.findAll('[role="tab"]')).toHaveLength(2)
})
```

**Store Test** (`stores/__tests__/budget.spec.ts`):
```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '~/stores/budget'

beforeEach(() => {
  setActivePinia(createPinia())
})

it('calculates balance correctly', () => {
  const store = useBudgetStore()
  store.addIncome({ description: 'Salary', amount: 5000, source: 'Salary', date: new Date().toISOString() })
  store.addExpense({ description: 'Rent', amount: 1500, category: 'Housing', date: new Date().toISOString() })
  expect(store.balance).toBe(3500)
})
```

---

## 🚢 Deployment

### Deploy to Netlify

#### Option 1: Netlify UI (Recommended)

1. **Create Netlify Account**
   - Go to [netlify.com](https://www.netlify.com/)
   - Sign up with GitHub

2. **Connect Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Authorize Netlify to access your repo

3. **Configure Build Settings**
   ```
   Build command: pnpm run generate
   Publish directory: .output/public
   ```

4. **Environment Variables** (optional)
   - Go to Site settings → Environment variables
   - Add `NUXT_PUBLIC_STORYBLOK_TOKEN` if using Storyblok

5. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `https://your-site-name.netlify.app`

#### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### Netlify Configuration

The `netlify.toml` file is pre-configured:

```toml
[build]
  command = "pnpm run generate"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "18"
  PNPM_VERSION = "8"

# SPA fallback for client-side routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Custom Domain

1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS with your provider
4. Netlify provides free SSL certificates

---

## 📝 Storyblok Integration (Optional)

### Why Storyblok?

- **Headless CMS**: Manage content without code changes
- **Visual Editor**: Real-time preview of content
- **Multi-language**: Built-in localization
- **Developer-friendly**: REST & GraphQL APIs

### Setup Steps

1. **Create Storyblok Account**
   ```
   https://app.storyblok.com/#!/signup
   ```

2. **Get Access Token**
   - Go to Settings → Access Tokens
   - Create new token (Preview or Public)
   - Copy the token

3. **Configure Environment**
   ```bash
   # Add to .env
   NUXT_PUBLIC_STORYBLOK_TOKEN=your_preview_token_here
   ```

4. **Install Storyblok Module**
   ```bash
   pnpm add @storyblok/nuxt
   ```

5. **Update nuxt.config.ts**
   ```typescript
   export default defineNuxtConfig({
     modules: [
       '@pinia/nuxt',
       ['@storyblok/nuxt', {
         accessToken: process.env.NUXT_PUBLIC_STORYBLOK_TOKEN
       }]
     ]
   })
   ```

6. **Create Composable** (`composables/useStoryblok.ts`):
   ```typescript
   export const useStoryblok = () => {
     const config = useRuntimeConfig()
     const token = config.public.storyblokToken

     const fetchStory = async (slug: string) => {
       const { data } = await $fetch(
         `https://api.storyblok.com/v2/cdn/stories/${slug}`,
         {
           params: {
             token,
             version: 'draft'
           }
         }
       )
       return data
     }

     return { fetchStory }
   }
   ```

7. **Use in Components**:
   ```vue
   <script setup lang="ts">
   const { fetchStory } = useStoryblok()
   const { data } = await useAsyncData('intro', () => fetchStory('intro'))
   </script>

   <template>
     <div v-if="data">{{ data.story.content.text }}</div>
   </template>
   ```

---

## 🔄 GitHub & CI/CD Setup

### Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Monthly Budget Planner"

# Create repo on GitHub
# Go to https://github.com/new

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/monthly-budget.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### GitHub Actions Workflow

The `.github/workflows/ci-cd.yml` file automates:

1. **Lint & Test** - Runs on every push/PR
2. **Build** - Generates production build
3. **Deploy** - Deploys to Netlify on main branch

### Required GitHub Secrets

Add these in GitHub: Settings → Secrets and variables → Actions

```
NUXT_PUBLIC_STORYBLOK_TOKEN  # Storyblok API token (if using)
NETLIFY_AUTH_TOKEN           # From Netlify User Settings → Applications
NETLIFY_SITE_ID              # From Netlify Site Settings → General
```

### Workflow Triggers

```yaml
on:
  push:
    branches: [main, develop]  # Auto-deploy on push
  pull_request:
    branches: [main, develop]  # Test on PRs
```

### Alternative: Netlify-Only Deployment

If you prefer Netlify's built-in CI/CD:

1. Connect GitHub repo in Netlify
2. Netlify auto-deploys on push to main
3. Remove GitHub Actions workflow (optional)

---

## ⚡ Performance & Best Practices

### Build Optimizations

**Code Splitting**:
```typescript
// nuxt.config.ts
vite: {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'chart': ['chart.js']  // Separate chunk for Chart.js
        }
      }
    }
  }
}
```

**Lazy Loading** (Future Enhancement):
```vue
<script setup lang="ts">
// Dynamic import for heavy components
const PieChart = defineAsyncComponent(() => import('~/components/PieChart.vue'))
</script>
```

### Accessibility Features

✅ **Implemented**:
- ARIA attributes on tabs (`role="tab"`, `aria-selected`)
- Keyboard navigation (Arrow keys, Home, End)
- Focus management with `:focus-visible`
- Semantic HTML (`<button>`, `<form>`)
- Screen reader text with `.sr-only` class

**Example**:
```vue
<button
  role="tab"
  :aria-selected="isActive"
  :aria-controls="`panel-${id}`"
  @keydown="handleKeydown"
>
  Tab Label
</button>
```

### Chart.js vs ECharts

| Feature | Chart.js | ECharts |
|---------|----------|---------|
| **Bundle Size** | ~200KB | ~800KB |
| **Performance** | Good for <1000 points | Better for large datasets |
| **Ease of Use** | ⭐⭐⭐⭐⭐ Simple API | ⭐⭐⭐ More complex |
| **Documentation** | Excellent | Good |
| **Customization** | High | Very High |
| **Mobile Support** | Good | Excellent |

**Recommendation**: Chart.js (chosen) for this project because:
- Smaller bundle size
- Simpler API for basic charts
- Sufficient for budget data visualization

### Caching Strategy

**Netlify Headers** (in `netlify.toml`):
```toml
[[headers]]
  for = "/_nuxt/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**LocalStorage Persistence**:
- Budget data persists across sessions
- Auto-saves on every change
- Fallback to sample data if empty

---

## 💡 VS Code Setup

### Recommended Extensions

Install from `.vscode/extensions.json`:
- **Volar** - Vue language support
- **ESLint** - Linting integration
- **Prettier** - Code formatting
- **Path Intellisense** - Autocomplete imports
- **GitHub Copilot** - AI assistance

### Quick Install

```bash
# VS Code will prompt to install on project open
# Or run manually:
code --install-extension vue.volar
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

### Keyboard Shortcuts

- `Cmd/Ctrl + Shift + P` → "Format Document" (Prettier)
- `Cmd/Ctrl + .` → Quick fix (ESLint)
- `F2` → Rename symbol (TypeScript)
- `F12` → Go to definition

---

## 📋 Next Steps & Feature Ideas

### Short-term Enhancements

- [ ] **Dark mode toggle** - Respect system preference
- [ ] **Date range filter** - View specific periods
- [ ] **Category colors** - Custom colors per category
- [ ] **Transaction search** - Filter by description
- [ ] **Budget goals** - Set monthly limits per category

### Medium-term Features

- [ ] **CSV Import/Export** - Bulk data management
  ```typescript
  // Example CSV export
  const exportToCSV = () => {
    const csv = expenses.map(e => 
      `${e.date},${e.description},${e.amount},${e.category}`
    ).join('\n')
    downloadFile(csv, 'expenses.csv')
  }
  ```

- [ ] **Recurring transactions** - Auto-add monthly expenses
- [ ] **Multi-currency support** - Currency conversion
- [ ] **Budget templates** - Pre-defined budget categories
- [ ] **Notifications** - Budget limit alerts

### Long-term Roadmap

- [ ] **User Authentication** - Firebase/Supabase auth
- [ ] **Cloud Sync** - Multi-device synchronization
- [ ] **Collaborative budgets** - Shared household budgets
- [ ] **Bank integration** - Auto-import transactions (Plaid)
- [ ] **Mobile app** - React Native/Ionic version
- [ ] **AI insights** - Spending pattern analysis

### Testing Expansion

- [ ] **E2E Tests** - Playwright/Cypress
  ```typescript
  // Example Playwright test
  test('should add expense', async ({ page }) => {
    await page.goto('/')
    await page.click('[aria-label="Expenses"]')
    await page.click('text=Add Expense')
    await page.fill('#description', 'Test')
    await page.fill('#amount', '100')
    await page.click('text=Add')
    await expect(page.locator('text=Test')).toBeVisible()
  })
  ```

- [ ] **Visual regression** - Percy/Chromatic
- [ ] **Performance tests** - Lighthouse CI

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

**Module not found errors**:
```bash
# Clear Nuxt cache and reinstall
rm -rf node_modules .nuxt .output
pnpm install
pnpm dev
```

**TypeScript errors in IDE**:
```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

**Build fails on Netlify**:
- Check Node version matches `package.json` engines
- Verify environment variables are set
- Check build logs for specific errors

---

## 📖 Key Concepts Explained

### Composables vs Stores

**Composables** (`composables/useBudget.ts`):
- Reusable logic with reactivity
- Can access stores or provide standalone logic
- Similar to React hooks

**Stores** (`stores/budget.ts`):
- Global state management with Pinia
- Centralized business logic
- Persistent across components

**When to use**:
- **Store**: Shared state (budget data)
- **Composable**: Reusable UI logic, API calls

### SPA vs SSR Mode

This project uses **SPA mode**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false  // Client-side only
})
```

**Why SPA for this project**:
- ✅ No backend needed
- ✅ LocalStorage persistence
- ✅ Static deployment (Netlify, GitHub Pages)
- ✅ Simpler architecture

**When to use SSR**:
- SEO-critical content
- Dynamic data from APIs
- Server-side auth

---

## 📚 Learning Resources

### Official Documentation
- [Nuxt 3 Docs](https://nuxt.com/docs)
- [Vue 3 Docs](https://vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Chart.js Docs](https://www.chartjs.org/)
- [Vitest Docs](https://vitest.dev/)

### Tutorials
- [Nuxt 3 Crash Course](https://www.youtube.com/watch?v=dCxSsr5xuL8)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html)

---

## 📄 License

MIT License - Feel free to use this project as a template!

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/monthly-budget/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/monthly-budget/discussions)
- 📧 **Email**: your-email@example.com

---

**Built with ❤️ using Nuxt 4, Vue 3, TypeScript, and Chart.js**
