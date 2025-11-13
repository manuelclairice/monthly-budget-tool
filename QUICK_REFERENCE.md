# Quick Reference Commands

## Development
```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm generate         # Generate static SPA
pnpm preview          # Preview production build
```

## Code Quality
```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm typecheck        # TypeScript check
```

## Testing
```bash
pnpm test             # Run tests
pnpm test:ui          # Test with UI
pnpm test:coverage    # Coverage report
```

## Key Files to Edit

**Add new tab**:
1. Create component in `app/components/YourView.vue`
2. Add to `app/pages/index.vue` tabs array
3. Import and add conditional render

**Add expense category**:
- Edit `app/components/ExpensesView.vue` → `categories` array

**Modify chart colors**:
- Edit `app/components/PieChart.vue` → `chartColors` array

**Change theme**:
- Edit `app/assets/css/main.css` → CSS variables in `:root`

## Deployment Checklist

- [ ] Run `pnpm test` - All tests pass
- [ ] Run `pnpm lint` - No lint errors
- [ ] Run `pnpm typecheck` - No type errors
- [ ] Run `pnpm generate` - Build succeeds
- [ ] Test in production mode: `pnpm preview`
- [ ] Set environment variables in Netlify
- [ ] Push to main branch (triggers deploy)

## Troubleshooting

**Port 3000 in use**:
```bash
lsof -ti:3000 | xargs kill -9
# or
PORT=3001 pnpm dev
```

**Module errors**:
```bash
rm -rf node_modules .nuxt
pnpm install
```

**Type errors in IDE**:
- VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
