# 🎨 Project Overview - Visual Reference

## 📁 Complete File Tree

```
monthly-budget-tool/
│
├── 📂 app/                              # Application source code
│   ├── 📂 assets/
│   │   └── 📂 css/
│   │       └── main.css                 # Global styles (CSS variables, utilities)
│   │
│   ├── 📂 components/
│   │   ├── 📂 __tests__/
│   │   │   ├── Tabs.spec.ts            # Tabs component tests
│   │   │   └── PieChart.spec.ts        # Chart component tests
│   │   ├── Tabs.vue                     # ⭐ Accessible tabs with keyboard nav
│   │   ├── PieChart.vue                 # ⭐ Chart.js wrapper component
│   │   ├── BudgetOverview.vue           # Overview tab (stats + chart)
│   │   ├── ExpensesView.vue             # Expenses management
│   │   ├── IncomeView.vue               # Income tracking
│   │   └── ReportsView.vue              # Reports & analytics
│   │
│   ├── 📂 composables/
│   │   └── useBudget.ts                 # ⭐ Budget management composable
│   │
│   ├── 📂 pages/
│   │   └── index.vue                    # ⭐ Main application page
│   │
│   ├── 📂 stores/
│   │   ├── 📂 __tests__/
│   │   │   └── budget.spec.ts          # Store tests
│   │   └── budget.ts                    # ⭐ Pinia store (state management)
│   │
│   ├── 📂 types/
│   │   └── budget.ts                    # TypeScript interfaces
│   │
│   └── app.vue                          # Root component
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── ci-cd.yml                    # ⭐ GitHub Actions CI/CD pipeline
│
├── 📂 .vscode/
│   ├── extensions.json                  # Recommended VS Code extensions
│   └── settings.json                    # Editor configuration
│
├── 📂 public/
│   └── robots.txt                       # SEO robots file
│
├── 📄 .env.example                      # ⭐ Environment variables template
├── 📄 .gitignore                        # Git ignore rules
├── 📄 .prettierrc                       # ⭐ Prettier configuration
├── 📄 eslint.config.mjs                 # ⭐ ESLint configuration
├── 📄 netlify.toml                      # ⭐ Netlify deployment config
├── 📄 nuxt.config.ts                    # ⭐ Nuxt configuration (SPA, TypeScript, Vite)
├── 📄 package.json                      # ⭐ Dependencies & scripts
├── 📄 pnpm-lock.yaml                    # Package lock file
├── 📄 tsconfig.json                     # ⭐ TypeScript configuration
├── 📄 vitest.config.ts                  # ⭐ Test configuration
│
├── 📘 README.md                         # ⭐ Project overview & quick start
├── 📗 SETUP_GUIDE.md                    # ⭐ Complete developer guide (600+ lines)
├── 📙 INSTALLATION.md                   # ⭐ Copy-paste installation commands
├── 📕 QUICK_REFERENCE.md                # Command cheatsheet
├── 📔 PROJECT_SUMMARY.md                # This deliverables summary
└── 📜 setup.sh                          # ⭐ Automated setup script

⭐ = Key files to review first
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interaction                        │
│                    (pages/index.vue)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Tabs Component                             │
│              (components/Tabs.vue)                           │
│   [Overview] [Expenses] [Income] [Reports]                  │
└─────────┬─────────┬──────────┬──────────┬───────────────────┘
          │         │          │          │
          ▼         ▼          ▼          ▼
    ┌─────────┐ ┌──────┐  ┌──────┐  ┌────────┐
    │Overview │ │Expenses│ │Income│  │Reports │
    │  View   │ │  View  │ │ View │  │  View  │
    └────┬────┘ └───┬────┘ └──┬───┘  └───┬────┘
         │          │         │          │
         └──────────┴─────────┴──────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  useBudget Composable  │
         │ (composables/useBudget)│
         └───────────┬────────────┘
                     │
                     ▼
         ┌────────────────────────┐
         │    Pinia Store         │
         │   (stores/budget)      │
         │                        │
         │ • expenses[]           │
         │ • income[]             │
         │ • totalExpenses        │
         │ • totalIncome          │
         │ • balance              │
         └───────────┬────────────┘
                     │
                     ▼
         ┌────────────────────────┐
         │    LocalStorage        │
         │  (Browser Storage)     │
         │                        │
         │ Persists data across   │
         │ page refreshes         │
         └────────────────────────┘
```

---

## 🎯 Component Hierarchy

```
App (app.vue)
│
└── pages/index.vue (Main Page)
    │
    ├── Header
    │   ├── Title: "💰 Monthly Budget Planner"
    │   └── Subtitle
    │
    ├── Tabs Component
    │   │
    │   ├── Tab: Overview
    │   │   └── BudgetOverview.vue
    │   │       ├── Stats Cards (Income, Expenses, Balance)
    │   │       ├── Budget Health Indicator
    │   │       └── PieChart (Expenses by Category)
    │   │
    │   ├── Tab: Expenses
    │   │   └── ExpensesView.vue
    │   │       ├── Add Expense Button
    │   │       ├── Expense Form (conditionally shown)
    │   │       └── Expenses List
    │   │           └── Expense Items (with delete)
    │   │
    │   ├── Tab: Income
    │   │   └── IncomeView.vue
    │   │       ├── Add Income Button
    │   │       ├── Income Form (conditionally shown)
    │   │       └── Income List
    │   │           └── Income Items (with delete)
    │   │
    │   └── Tab: Reports
    │       └── ReportsView.vue
    │           ├── Key Insights Card
    │           ├── Summary Card
    │           ├── PieChart (Expenses by Category)
    │           ├── PieChart (Income by Source)
    │           └── Comparison Bars (Income vs Expenses)
    │
    └── Footer
        └── Copyright
```

---

## 📊 State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PINIA STORE (stores/budget.ts)           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STATE                                                      │
│  ├── expenses: Expense[]                                    │
│  └── income: Income[]                                       │
│                                                             │
│  GETTERS (Computed Values)                                  │
│  ├── totalExpenses → sum of all expenses                    │
│  ├── totalIncome → sum of all income                        │
│  ├── balance → totalIncome - totalExpenses                  │
│  ├── expensesByCategory → Record<string, number>            │
│  └── incomeBySource → Record<string, number>                │
│                                                             │
│  ACTIONS                                                    │
│  ├── addExpense(expense)                                    │
│  ├── removeExpense(id)                                      │
│  ├── addIncome(income)                                      │
│  ├── removeIncome(id)                                       │
│  ├── saveToStorage() → localStorage                         │
│  ├── loadFromStorage() ← localStorage                       │
│  ├── initializeSampleData()                                 │
│  └── clearAllData()                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           ▲ ▼
                    ┌──────────────┐
                    │  useBudget   │
                    │  Composable  │
                    └──────────────┘
                           ▲ ▼
                    ┌──────────────┐
                    │  Components  │
                    └──────────────┘
```

---

## 🧪 Testing Strategy

```
Unit Tests (Vitest)
│
├── Component Tests
│   ├── Tabs.spec.ts
│   │   ├── ✓ Renders all tabs
│   │   ├── ✓ Active tab state
│   │   ├── ✓ Click handling
│   │   ├── ✓ Keyboard navigation
│   │   └── ✓ Accessibility
│   │
│   └── PieChart.spec.ts
│       ├── ✓ Renders canvas
│       ├── ✓ Props handling
│       ├── ✓ Height setting
│       └── ✓ ARIA attributes
│
└── Store Tests
    └── budget.spec.ts
        ├── ✓ Initial state
        ├── ✓ CRUD operations
        ├── ✓ Computed values
        └── ✓ Data persistence

Run: pnpm test
```

---

## 🚀 Deployment Pipeline

```
Developer
   │
   │ git push
   ▼
┌─────────────────────┐
│  GitHub Repository  │
└──────────┬──────────┘
           │
           │ Trigger
           ▼
┌─────────────────────┐
│  GitHub Actions     │
│  (.github/workflows)│
│                     │
│  Jobs:              │
│  1. Lint & Test     │
│  2. Build           │
│  3. Deploy          │
└──────────┬──────────┘
           │
           │ Deploy
           ▼
┌─────────────────────┐
│     Netlify         │
│                     │
│  • Build: generate  │
│  • Publish: .output │
│  • CDN Distribution │
└──────────┬──────────┘
           │
           │ Live at:
           ▼
    https://your-app.netlify.app
```

---

## 📦 Build Output

```
Production Build (pnpm generate)
│
├── .output/
│   └── public/                    ← Deploy this folder
│       ├── index.html             # SPA entry point
│       ├── _nuxt/
│       │   ├── entry.[hash].js    # Main bundle
│       │   ├── chart.[hash].js    # Chart.js chunk
│       │   └── *.css              # Stylesheets
│       ├── favicon.ico
│       └── robots.txt

Size Optimization:
• Code splitting: Chart.js separated
• Tree-shaking: Unused code removed
• Minification: All files compressed
• Caching: Long-term cache headers
```

---

## 🎨 Styling System

```
CSS Architecture
│
├── Global Styles (assets/css/main.css)
│   │
│   ├── CSS Variables
│   │   ├── Colors (primary, success, warning, danger)
│   │   ├── Spacing (xs, sm, md, lg, xl, 2xl)
│   │   ├── Typography (font-size, font-family)
│   │   ├── Border Radius (sm, md, lg, xl)
│   │   ├── Shadows (sm, md, lg)
│   │   └── Transitions (fast, base)
│   │
│   ├── Base Styles
│   │   ├── Reset (*,*::before,*::after)
│   │   ├── Body styles
│   │   └── Typography (h1-h6, p)
│   │
│   ├── Utility Classes
│   │   ├── .container
│   │   └── .sr-only (accessibility)
│   │
│   └── Dark Mode Support (prefers-color-scheme)
│
└── Component Styles (Scoped)
    └── <style scoped> in each .vue file
```

---

## 🔑 Key TypeScript Interfaces

```typescript
// types/budget.ts

interface BudgetTransaction {
  id: string
  description: string
  amount: number
  date: string
}

interface Expense extends BudgetTransaction {
  category: string
  // Categories: 'Food & Dining', 'Transportation',
  //            'Housing', 'Utilities', etc.
}

interface Income extends BudgetTransaction {
  source: string
  // Sources: 'Salary', 'Freelance', 'Investment',
  //         'Business', 'Gift', 'Other'
}

interface BudgetState {
  expenses: Expense[]
  income: Income[]
}
```

---

## 🎯 User Interactions

```
User Journey
│
├── Landing (Overview Tab)
│   ├── See budget summary
│   ├── View balance & health
│   └── See expense breakdown chart
│
├── Add Expense
│   ├── Click "Expenses" tab
│   ├── Click "+ Add Expense"
│   ├── Fill form (description, amount, category)
│   ├── Submit
│   └── See in list + chart updates
│
├── Add Income
│   ├── Click "Income" tab
│   ├── Click "+ Add Income"
│   ├── Fill form (description, amount, source)
│   ├── Submit
│   └── See in list + balance updates
│
└── View Reports
    ├── Click "Reports" tab
    ├── See key insights
    ├── View expense/income charts
    └── Compare income vs expenses
```

---

## 📋 Scripts Reference

```json
{
  "dev": "nuxt dev", // → Start dev server (hot reload)
  "build": "nuxt build", // → Build for production
  "generate": "nuxt generate", // → Generate static SPA
  "preview": "nuxt preview", // → Preview production build
  "postinstall": "nuxt prepare", // → Setup Nuxt environment
  "lint": "eslint .", // → Lint code
  "lint:fix": "eslint . --fix", // → Fix lint issues
  "format": "prettier --write", // → Format code
  "typecheck": "nuxt typecheck", // → Check TypeScript
  "test": "vitest", // → Run tests
  "test:ui": "vitest --ui", // → Test with UI
  "test:coverage": "vitest --coverage" // → Coverage report
}
```

---

## 🌟 Feature Highlights

### ✅ Implemented

- [x] Interactive Budget Dashboard
- [x] Expense & Income Tracking
- [x] Category-based Organization
- [x] Pie Chart Visualizations
- [x] Budget Health Indicator
- [x] LocalStorage Persistence
- [x] Responsive Mobile Design
- [x] Keyboard Accessibility
- [x] TypeScript Type Safety
- [x] Unit Tests (25+ tests)
- [x] CI/CD Pipeline
- [x] One-Click Deployment

### 🔮 Future Enhancements (Roadmap in SETUP_GUIDE.md)

- [ ] CSV Import/Export
- [ ] Dark Mode Toggle
- [ ] Date Range Filters
- [ ] Budget Goals & Alerts
- [ ] Recurring Transactions
- [ ] Multi-Currency Support
- [ ] User Authentication
- [ ] Cloud Synchronization

---

## 📖 Documentation Index

| Document             | Description                           | Best For          |
| -------------------- | ------------------------------------- | ----------------- |
| `README.md`          | Quick overview & getting started      | First-time users  |
| `SETUP_GUIDE.md`     | Complete developer guide (600+ lines) | In-depth learning |
| `INSTALLATION.md`    | Step-by-step commands                 | Copy-paste setup  |
| `QUICK_REFERENCE.md` | Command cheatsheet                    | Daily development |
| `PROJECT_SUMMARY.md` | Deliverables checklist                | Project overview  |

---

**🎉 Everything is ready to use! Start with: `pnpm install && pnpm dev`**
