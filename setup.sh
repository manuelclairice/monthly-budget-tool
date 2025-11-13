#!/bin/bash

# Monthly Budget Planner - Quick Start Script
# This script sets up the project for first-time users

set -e  # Exit on error

echo "🎯 Monthly Budget Planner - Quick Start"
echo "========================================"
echo ""

# Check for pnpm
if ! command -v pnpm &> /dev/null
then
    echo "❌ pnpm is not installed"
    echo "📦 Installing pnpm globally..."
    npm install -g pnpm
    echo "✅ pnpm installed successfully"
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher required"
    echo "   Current version: $(node -v)"
    echo "   Please upgrade Node.js: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ pnpm version: $(pnpm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo ""

# Copy environment file
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "   Edit .env to add your environment variables"
else
    echo "ℹ️  .env file already exists, skipping..."
fi
echo ""

# Run tests to verify setup
echo "🧪 Running tests to verify setup..."
pnpm test --run
echo ""

echo "✨ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Review SETUP_GUIDE.md for detailed documentation"
echo "   2. Run 'pnpm dev' to start development server"
echo "   3. Visit http://localhost:3000"
echo ""
echo "🚀 Happy coding!"
