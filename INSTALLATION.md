# 🎯 Monthly Budget Planner - Complete Installation Commands

This file contains all the commands you need to copy/paste to get started.

## Prerequisites Installation

```bash
# Install Node.js 18+ (if not installed)
# macOS (using Homebrew)
brew install node@18

# Or download from: https://nodejs.org/

# Install pnpm globally
npm install -g pnpm

# Verify installations
node --version  # Should be >= 18
pnpm --version  # Should be >= 8
```

## Project Setup (From Scratch)

```bash
# Navigate to your projects directory
cd ~/projects

# Create project with Nuxt 4
pnpm dlx nuxi@latest init monthly-budget-tool

# Navigate to project
cd monthly-budget-tool

# Install all dependencies from package.json
pnpm install
```

## Install All Dependencies

```bash
# Core dependencies (already in package.json)
pnpm add @pinia/nuxt pinia chart.js

# Development dependencies
pnpm add -D @nuxt/eslint @nuxt/test-utils @types/node @vitejs/plugin-vue @vitest/ui @vue/test-utils eslint happy-dom playwright-core prettier typescript vite vitest
```

## Setup Configuration Files

All configuration files are already created in the project. Just verify they exist:

```bash
# List all config files
ls -la nuxt.config.ts package.json tsconfig.json vitest.config.ts netlify.toml .prettierrc eslint.config.mjs
```

## Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env (optional - only needed for Storyblok)
# Add your Storyblok token if using CMS:
# NUXT_PUBLIC_STORYBLOK_TOKEN=your_token_here
```

## Development Server

```bash
# Start development server
pnpm dev

# Server will run at: http://localhost:3000
# Hot reload is enabled - changes appear immediately
```

## Run Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

## Code Quality Checks

```bash
# Lint code
pnpm lint

# Auto-fix lint issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# TypeScript type checking
pnpm typecheck
```

## Build for Production

```bash
# Generate static SPA build
pnpm generate

# Output will be in: .output/public/

# Preview production build locally
pnpm preview
```

## Git Setup

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial commit - Monthly Budget Planner with Nuxt 4"

# Create repository on GitHub (via web interface)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/monthly-budget.git
git branch -M main
git push -u origin main
```

## Netlify Deployment (Option 1: UI)

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command**: `pnpm run generate`
   - **Publish directory**: `.output/public`
   - **Node version**: 18 (set in netlify.toml)
5. Click "Deploy site"
6. Your site will be live at: `https://your-site-name.netlify.app`

## Netlify Deployment (Option 2: CLI)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and link site
netlify init

# Deploy to production
netlify deploy --prod
```

## Environment Variables on Netlify

1. Go to: Site settings → Environment variables
2. Add variables:
   ```
   NUXT_PUBLIC_STORYBLOK_TOKEN = your_token_here
   ```
3. Trigger redeploy for changes to take effect

## GitHub Actions Setup

Add these secrets in GitHub: Settings → Secrets and variables → Actions

```bash
# Required for automated deployments:
NETLIFY_AUTH_TOKEN      # From: Netlify User Settings → Applications → Personal access tokens
NETLIFY_SITE_ID         # From: Netlify Site Settings → General → Site information
NUXT_PUBLIC_STORYBLOK_TOKEN  # Your Storyblok token (if using)
```

## VS Code Setup

```bash
# Install recommended extensions
code --install-extension vue.volar
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension christian-kohler.path-intellisense

# Or let VS Code prompt you from .vscode/extensions.json
```

## Quick Start Script

```bash
# Make setup script executable (already done)
chmod +x setup.sh

# Run automated setup
./setup.sh

# This will:
# - Check prerequisites
# - Install dependencies
# - Create .env file
# - Run tests to verify
```

## Storyblok Integration (Optional)

```bash
# Install Storyblok module
pnpm add @storyblok/nuxt

# Get your token from:
# https://app.storyblok.com/#/me/account?tab=token

# Add to .env:
echo "NUXT_PUBLIC_STORYBLOK_TOKEN=your_token_here" >> .env

# Uncomment Storyblok module in nuxt.config.ts
```

## Useful Commands Reference

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production  
pnpm generate               # Generate static SPA
pnpm preview                # Preview production build

# Testing
pnpm test                   # Run tests
pnpm test:ui                # Test UI
pnpm test:coverage          # Coverage report

# Code Quality
pnpm lint                   # Lint code
pnpm lint:fix               # Fix lint issues
pnpm format                 # Format code
pnpm typecheck              # Type check

# Cleanup
rm -rf node_modules .nuxt .output  # Clean everything
pnpm install                       # Reinstall
```

## Troubleshooting Commands

```bash
# Port already in use
lsof -ti:3000 | xargs kill -9

# Clear cache and reinstall
rm -rf node_modules .nuxt .output pnpm-lock.yaml
pnpm install

# Update all dependencies
pnpm update

# Check for outdated packages
pnpm outdated
```

## File Structure Verification

```bash
# Verify all files are created
tree -L 3 -I 'node_modules|.nuxt|.output'

# Should show:
# .
# ├── app/
# │   ├── assets/
# │   ├── components/
# │   ├── composables/
# │   ├── pages/
# │   ├── stores/
# │   └── types/
# ├── .github/
# │   └── workflows/
# ├── .vscode/
# ├── public/
# ├── .env.example
# ├── .gitignore
# ├── .prettierrc
# ├── eslint.config.mjs
# ├── netlify.toml
# ├── nuxt.config.ts
# ├── package.json
# ├── README.md
# ├── SETUP_GUIDE.md
# ├── setup.sh
# ├── tsconfig.json
# └── vitest.config.ts
```

## Success Checklist

After running all commands, verify:

- [ ] `pnpm dev` starts without errors
- [ ] App opens at http://localhost:3000
- [ ] Sample budget data displays
- [ ] Tabs switch correctly
- [ ] Pie chart renders
- [ ] `pnpm test` passes all tests
- [ ] `pnpm lint` shows no errors
- [ ] `pnpm generate` builds successfully

## Next Steps

1. ✅ **Read**: `SETUP_GUIDE.md` for comprehensive documentation
2. ✅ **Review**: `QUICK_REFERENCE.md` for common commands
3. ✅ **Start coding**: Add your features!
4. ✅ **Deploy**: Push to GitHub and deploy to Netlify

---

**Need help?** Check SETUP_GUIDE.md or open an issue on GitHub.
