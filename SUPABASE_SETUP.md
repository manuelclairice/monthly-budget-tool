# Monthly Budget Planner - Supabase Authentication Setup

This project now includes Supabase authentication. Follow these steps to set it up:

## 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## 2. Get Your Supabase Credentials

1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project API Key** (anon/public key)

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-anon-public-key-here
   ```

## 4. Enable Email Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Configure email templates under **Authentication** → **Email Templates** (optional)

## 5. Run the Development Server

```bash
pnpm install
pnpm dev
```

## Features

- **Sign Up**: Users can create accounts with email/password
- **Sign In**: Secure authentication with existing credentials
- **Sign Out**: Log out from the application
- **Protected Routes**: Budget pages require authentication
- **User Profile**: Display user information in header

## Routes

- `/login` - Sign in page
- `/signup` - Create new account
- `/` - Main budget planner (protected)

## Notes

- Email confirmation is enabled by default in Supabase
- Users must verify their email before signing in
- You can disable email confirmation in Supabase settings if needed for development
