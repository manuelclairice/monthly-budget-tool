# 💰 Monthly Budget Planner

A modern, production-ready **Single Page Application (SPA)** for tracking monthly budgets with interactive charts and tabs navigation.

![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js)
![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

## ✨ Features

- 📊 **Interactive Pie Charts** - Visualize expenses and income with Chart.js
- 🎯 **Tab Navigation** - Overview, Expenses, Income, and Reports views
- 💾 **Persistent Storage** - LocalStorage for offline data persistence
- 🎨 **Accessible UI** - ARIA attributes, keyboard navigation, focus management
- 🧪 **Well-Tested** - Unit tests with Vitest and Vue Test Utils
- 🚀 **Optimized Build** - Vite with code splitting and tree-shaking
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🌊 **Ocean Theme** - Calming, modern design with muted teal and sage green palette
- ✏️ **Edit Inline** - Update expenses and income without deleting
- 📅 **Month History** - Track and compare previous months automatically
- 🎨 **Inter Font** - Clean, professional typography

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# → http://localhost:3000

# Run tests
pnpm test

# Build for production
pnpm generate
```

## 📚 Documentation

📖 **[Complete Setup Guide](./SETUP_GUIDE.md)** - Comprehensive developer documentation including:

- Detailed installation instructions
- Project structure explanation
- Testing guide with examples
- Netlify deployment steps
- Storyblok CMS integration
- GitHub Actions CI/CD setup
- Performance best practices
- VS Code configuration
- Feature roadmap

## 🛠 Tech Stack

**Framework & Build**

- Nuxt 4 (Vue 3 + Composition API)
- TypeScript
- Vite

**State & Data**

- Pinia (state management)
- LocalStorage (persistence)

**UI & Charts**

- Chart.js 4
- Custom CSS with CSS variables

**Testing & Quality**

- Vitest (unit tests)
- ESLint + Prettier
- TypeScript strict mode

**Deployment**

- Netlify (recommended)
- GitHub Actions (CI/CD)

## 📁 Project Structure

```
app/
├── components/          # Vue components
│   ├── Tabs.vue        # Accessible tabs component
│   ├── PieChart.vue    # Chart.js wrapper
│   └── ...             # View components
├── composables/        # Reusable composition functions
├── stores/             # Pinia stores
├── pages/              # Nuxt pages
└── types/              # TypeScript types

.github/
└── workflows/          # CI/CD automation

.vscode/                # VS Code settings
netlify.toml            # Netlify config
nuxt.config.ts          # Nuxt configuration
vitest.config.ts        # Test configuration
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test --watch

# UI mode
pnpm test:ui

# Coverage report
pnpm test:coverage
```

Example test:

```typescript
it('calculates balance correctly', () => {
  const store = useBudgetStore()
  store.addIncome({ description: 'Salary', amount: 5000, ... })
  store.addExpense({ description: 'Rent', amount: 1500, ... })
  expect(store.balance).toBe(3500)
})
```

## 🚢 Deployment

### Netlify (Recommended)

1. **Connect GitHub repo** to Netlify
2. **Configure build**:
   - Build command: `pnpm run generate`
   - Publish directory: `.output/public`
3. **Deploy** - Automatic on push to main

Or use the CLI:

```bash
netlify init
netlify deploy --prod
```

### Environment Variables

```bash
# Optional: Storyblok CMS integration
NUXT_PUBLIC_STORYBLOK_TOKEN=your_token_here
```

## 📊 Example Usage

```vue
<script setup lang="ts">
import { useBudget } from '~/composables/useBudget'

const { totalIncome, totalExpenses, balance, addExpense } = useBudget()

const handleAddExpense = () => {
  addExpense({
    description: 'Grocery Shopping',
    amount: 150,
    category: 'Food & Dining',
    date: new Date().toISOString()
  })
}
</script>
```

## 🎯 Next Steps

- [ ] Add CSV import/export
- [ ] Implement dark mode toggle
- [ ] Add date range filters
- [ ] Set budget goals per category
- [ ] Add recurring transactions
- [ ] User authentication (Firebase/Supabase)
- [ ] Cloud sync for multi-device

## 🤝 Contributing

Contributions welcome! See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for development setup.

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - use freely for personal or commercial projects!

## 🔗 Links

- [Nuxt Documentation](https://nuxt.com)
- [Vue 3 Documentation](https://vuejs.org)
- [Chart.js Documentation](https://www.chartjs.org)
- [Pinia Documentation](https://pinia.vuejs.org)

---

**Built with ❤️ using Nuxt 4, Vue 3, and TypeScript**
