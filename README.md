# SubTracker - Subscription Management App

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?logo=supabase&labelColor=1a1a1a)](https://supabase.com)

A modern subscription tracking application built with Nuxt 4, Nuxt UI, and Supabase. Track all your recurring subscriptions, monitor costs, and never miss a payment deadline.

## ✨ Features

- 🔐 **Secure Authentication** - Email/password auth with Supabase
- 📊 **Smart Dashboard** - Overview of subscriptions and upcoming payments
- 💳 **Subscription Management** - Full CRUD operations for subscriptions
- 📅 **Multiple Billing Cycles** - Support for weekly, monthly, and yearly subscriptions
- 💰 **Cost Analytics** - Track total monthly spending across all subscriptions
- 🎨 **Beautiful UI** - Modern interface built with Nuxt UI components
- 🌙 **Dark Mode** - Automatic dark mode support
- 📱 **Responsive** - Works perfectly on mobile and desktop
- 🔒 **Secure** - Row-level security with Supabase

## 🚀 Quick Start

**New to this project?** See [QUICKSTART.md](./QUICKSTART.md) for a step-by-step guide.

**Need detailed information?** Check out [SETUP.md](./SETUP.md) for complete documentation.

## 📋 Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- A Supabase account (free tier works perfectly)

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from Project Settings > API
3. Create a `.env` file:

```env
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric not null,
  currency text not null default 'USD',
  billing_cycle text not null check (billing_cycle in ('weekly', 'monthly', 'yearly')),
  next_billing_date date not null,
  status text not null default 'active' check (status in ('active', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table subscriptions enable row level security;

create policy "Users can manage their own subscriptions"
  on subscriptions for all
  using (auth.uid() = user_id);
```

See [SETUP.md](./SETUP.md) for complete SQL with RLS policies.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## 💻 Development

Start the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com)
- **UI Library**: [Nuxt UI](https://ui.nuxt.com) (Tailwind CSS)
- **Database & Auth**: [Supabase](https://supabase.com)
- **Validation**: [Zod](https://zod.dev)
- **Language**: TypeScript

## 📂 Project Structure

```
app/
├── composables/          # Business logic
│   ├── useAuth.ts       # Authentication
│   └── useSubscriptions.ts  # Subscription CRUD
├── layouts/
│   ├── default.vue      # Public pages
│   ├── auth.vue         # Login/signup
│   └── app.vue          # Authenticated app
├── middleware/
│   └── auth.global.ts   # Route protection
├── pages/
│   ├── index.vue        # Landing page
│   ├── auth/            # Login & signup
│   └── app/             # Dashboard & features
└── plugins/
    └── supabase.client.ts  # Supabase setup
```

## 🔑 Environment Variables

| Variable            | Description                 |
| ------------------- | --------------------------- |
| `SUPABASE_URL`      | Your Supabase project URL   |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

Works with any Node.js hosting:

- Netlify
- Cloudflare Pages
- AWS
- DigitalOcean

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Get started quickly
- [SETUP.md](./SETUP.md) - Complete setup guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details

## 🛠️ Available Scripts

```bash
pnpm dev        # Start dev server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm lint       # Lint code
pnpm typecheck  # Type check
```

## 🎯 Key Features

### Authentication

- Secure email/password authentication
- Session persistence
- Protected routes
- Auto-redirect logic

### Dashboard

- Active subscriptions count
- Total monthly cost
- Upcoming payments (next 30 days)
- Quick actions

### Subscription Management

- Create, edit, delete subscriptions
- Support for weekly/monthly/yearly billing
- Multi-currency support
- Status tracking (active/cancelled)

## 🤝 Contributing

This is a personal project template. Feel free to fork and customize!

## 📄 License

MIT

## 🙏 Acknowledgments

- Built with [Nuxt UI](https://ui.nuxt.com)
- Powered by [Supabase](https://supabase.com)
- Based on [Nuxt UI SaaS Template](https://github.com/nuxt-ui-templates/saas)
