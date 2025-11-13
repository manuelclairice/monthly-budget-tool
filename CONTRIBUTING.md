# 🤝 Contributing to Monthly Budget Planner

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Feature Requests](#feature-requests)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

✅ **Do:**

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards others

❌ **Don't:**

- Use inappropriate language
- Engage in personal attacks
- Publish others' private information
- Behave unprofessionally

---

## 🚀 Getting Started

### Prerequisites

```bash
node --version  # >= 18.0.0
pnpm --version  # >= 8.0.0
```

### Fork & Clone

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/monthly-budget.git
cd monthly-budget/monthly-budget-tool

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/monthly-budget.git

# 4. Install dependencies
pnpm install
```

### Verify Setup

```bash
# Run tests
pnpm test

# Start dev server
pnpm dev

# Check linting
pnpm lint
```

---

## 🔄 Development Workflow

### 1. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming conventions:**

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### 2. Make Changes

```bash
# Make your changes

# Run tests frequently
pnpm test --watch

# Check types
pnpm typecheck

# Lint code
pnpm lint:fix
```

### 3. Commit Changes

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add CSV export functionality"

# Push to your fork
git push origin feature/your-feature-name
```

### 4. Stay Updated

```bash
# Fetch upstream changes
git fetch upstream

# Rebase your branch
git rebase upstream/main

# Resolve conflicts if any
# Then continue
git rebase --continue

# Force push (only on your branch!)
git push origin feature/your-feature-name --force
```

---

## 📝 Pull Request Process

### Before Submitting

✅ **Checklist:**

- [ ] Tests pass: `pnpm test`
- [ ] Linting passes: `pnpm lint`
- [ ] Type checking passes: `pnpm typecheck`
- [ ] Build succeeds: `pnpm generate`
- [ ] Code is formatted: `pnpm format`
- [ ] Added tests for new features
- [ ] Updated documentation
- [ ] No console errors or warnings

### Submit PR

1. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request on GitHub**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Template**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing

   - [ ] Tests added/updated
   - [ ] All tests pass
   - [ ] Manual testing performed

   ## Screenshots (if applicable)

   [Add screenshots here]

   ## Checklist

   - [ ] Code follows project style
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No new warnings
   ```

### Code Review

- **Be patient** - Reviews may take a few days
- **Be responsive** - Address feedback promptly
- **Be collaborative** - Work with reviewers
- **Be respectful** - Accept constructive criticism

### After Approval

1. **Squash commits** (if requested)

   ```bash
   git rebase -i HEAD~N  # N = number of commits
   ```

2. **Merge** - Maintainers will merge your PR

3. **Cleanup**
   ```bash
   git checkout main
   git pull upstream main
   git branch -d feature/your-feature-name
   ```

---

## 💻 Coding Standards

### TypeScript

```typescript
// ✅ Good
interface Expense {
  id: string
  amount: number
  category: string
}

const addExpense = (expense: Omit<Expense, 'id'>): void => {
  // ...
}

// ❌ Bad
const addExpense = (expense: any) => {
  // ...
}
```

### Vue Components

```vue
<!-- ✅ Good -->
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const doubled = computed(() => props.count * 2)
</script>

<template>
  <div class="component">
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}, Doubled: {{ doubled }}</p>
  </div>
</template>

<style scoped>
.component {
  padding: var(--spacing-md);
}
</style>
```

### Naming Conventions

| Type        | Convention                  | Example              |
| ----------- | --------------------------- | -------------------- |
| Components  | PascalCase                  | `BudgetOverview.vue` |
| Composables | camelCase with `use` prefix | `useBudget.ts`       |
| Stores      | camelCase with `use` prefix | `useBudgetStore()`   |
| Constants   | SCREAMING_SNAKE_CASE        | `MAX_BUDGET`         |
| Variables   | camelCase                   | `totalExpenses`      |
| Functions   | camelCase                   | `addExpense()`       |
| Interfaces  | PascalCase                  | `Expense`, `Income`  |

### File Organization

```
component.vue
├── <script setup lang="ts">
│   ├── Imports
│   ├── Props/Emits
│   ├── Reactive state
│   ├── Computed values
│   ├── Functions
│   └── Lifecycle hooks
├── <template>
└── <style scoped>
```

---

## 🧪 Testing Guidelines

### Write Tests For

✅ **Required:**

- New features
- Bug fixes
- Critical business logic
- Utility functions
- Store actions/getters

✅ **Nice to have:**

- Edge cases
- Error handling
- Component rendering

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Reset state
  })

  // Test cases
  it('should do something specific', () => {
    // Arrange
    const input = 'test'

    // Act
    const result = doSomething(input)

    // Assert
    expect(result).toBe('expected')
  })

  it('should handle edge cases', () => {
    // ...
  })
})
```

### Coverage Goals

- **Minimum**: 70% overall coverage
- **Target**: 80%+ for new code
- **Critical paths**: 100% coverage

```bash
# Check coverage
pnpm test:coverage
```

---

## 📝 Commit Messages

### Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type       | Description                  | Example                            |
| ---------- | ---------------------------- | ---------------------------------- |
| `feat`     | New feature                  | `feat: add CSV export`             |
| `fix`      | Bug fix                      | `fix: correct balance calculation` |
| `docs`     | Documentation                | `docs: update setup guide`         |
| `style`    | Code style (no logic change) | `style: format with prettier`      |
| `refactor` | Code refactoring             | `refactor: simplify store logic`   |
| `test`     | Add/update tests             | `test: add expense store tests`    |
| `chore`    | Maintenance                  | `chore: update dependencies`       |
| `perf`     | Performance improvement      | `perf: optimize chart rendering`   |

### Examples

```bash
# Simple commit
git commit -m "feat: add dark mode toggle"

# With scope
git commit -m "fix(budget): correct total calculation"

# With body
git commit -m "feat: add CSV export

- Add export button
- Implement CSV generation
- Add download functionality"

# Breaking change
git commit -m "feat!: redesign budget API

BREAKING CHANGE: Budget interface changed
Migrate by updating Expense type"
```

---

## 💡 Feature Requests

### Before Requesting

1. **Search existing issues** - Check if already requested
2. **Check roadmap** - See `SETUP_GUIDE.md#next-steps`
3. **Consider scope** - Should it be in core or plugin?

### Create Feature Request

**Template:**

```markdown
## Feature Description

Clear description of the feature

## Use Case

Why is this needed?

## Proposed Solution

How could it work?

## Alternatives Considered

Other approaches considered

## Additional Context

Screenshots, mockups, etc.
```

---

## 🐛 Bug Reports

### Before Reporting

1. **Update dependencies**: `pnpm install`
2. **Clear cache**: `rm -rf .nuxt .output`
3. **Search existing issues**
4. **Reproduce in clean environment**

### Bug Report Template

```markdown
## Bug Description

Clear description of the bug

## To Reproduce

Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- OS: [e.g., macOS 13.0]
- Node: [e.g., 18.15.0]
- Browser: [e.g., Chrome 110]
- Version: [e.g., 1.0.0]

## Screenshots

If applicable

## Additional Context

Any other info
```

---

## 📚 Documentation

### When to Update Docs

✅ **Always update docs when:**

- Adding new features
- Changing APIs
- Modifying configuration
- Adding dependencies
- Changing workflows

### Doc Files to Update

| Change Type   | Update Files                           |
| ------------- | -------------------------------------- |
| New feature   | `README.md`, `SETUP_GUIDE.md`          |
| API change    | `SETUP_GUIDE.md`, component docs       |
| Config change | `SETUP_GUIDE.md`, config file comments |
| New command   | `QUICK_REFERENCE.md`                   |
| Architecture  | `VISUAL_REFERENCE.md`                  |

---

## 🎯 Best Practices

### Code Review

**As Author:**

- Keep PRs small and focused
- Provide context in description
- Respond to feedback promptly
- Be open to suggestions

**As Reviewer:**

- Be constructive and kind
- Explain the "why" behind suggestions
- Approve promptly if looks good
- Test changes locally when possible

### Communication

✅ **Do:**

- Ask questions if unclear
- Share progress on long-running tasks
- Notify if you can't complete something
- Help other contributors

❌ **Don't:**

- Go silent for extended periods
- Work on multiple PRs simultaneously
- Ignore failing CI checks
- Make assumptions without confirming

---

## 🎓 Learning Resources

### For New Contributors

1. **Project docs**: Start with `00-START-HERE.md`
2. **Tech stack**: Review `SETUP_GUIDE.md`
3. **Code exploration**: Read component files
4. **Tests**: Study test files for examples

### External Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Nuxt 3 Documentation](https://nuxt.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🏆 Recognition

Contributors will be:

- Listed in project README
- Credited in release notes
- Mentioned in commit messages (co-authors)

---

## 📞 Getting Help

**Stuck? Need help?**

1. **Documentation**: Check `SETUP_GUIDE.md`
2. **Issues**: Search existing GitHub issues
3. **Discussions**: Start a GitHub discussion
4. **Questions**: Ask in issue comments

---

## 🙏 Thank You!

Every contribution helps make this project better. Whether it's:

- Reporting a bug
- Suggesting a feature
- Writing documentation
- Submitting code

**You're awesome! 🌟**

---

**Happy Contributing! 🚀**
