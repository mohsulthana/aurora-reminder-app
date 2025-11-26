# Subscription Reminder App

A full-featured subscription management application built with Nuxt 4, Nuxt UI, and Supabase.

## Features

- 🔐 **Authentication** - Email/password authentication with Supabase
- 📊 **Dashboard** - Overview of all subscriptions and upcoming payments
- 💳 **Subscription Management** - Create, read, update, and delete subscriptions
- 📅 **Payment Tracking** - Track billing cycles (weekly, monthly, yearly)
- 🎨 **Modern UI** - Beautiful interface with Nuxt UI components
- 🌙 **Dark Mode** - Automatic dark mode support
- 📱 **Responsive** - Mobile-first design

## Tech Stack

- **Framework**: Nuxt 4
- **UI Library**: Nuxt UI (Tailwind CSS)
- **Database & Auth**: Supabase
- **Validation**: Zod
- **TypeScript**: Full type safety

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account

## Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
pnpm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to find your credentials
3. Create a `.env` file in the root directory:

```env
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Schema

Run this SQL in your Supabase SQL Editor to create the subscriptions table:

```sql
-- Create subscriptions table
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

-- Enable RLS
alter table subscriptions enable row level security;

-- Create policies
create policy "Users can view their own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can create their own subscriptions"
  on subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own subscriptions"
  on subscriptions for delete
  using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on subscriptions
  for each row
  execute function handle_updated_at();
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── components/          # Reusable Vue components
├── composables/
│   ├── useAuth.ts      # Authentication logic
│   └── useSubscriptions.ts  # Subscription CRUD operations
├── layouts/
│   ├── default.vue     # Public layout
│   ├── auth.vue        # Auth pages layout
│   └── app.vue         # Authenticated app layout
├── middleware/
│   └── auth.global.ts  # Route protection
├── pages/
│   ├── index.vue       # Landing page
│   ├── auth/
│   │   ├── login.vue   # Login page
│   │   └── signup.vue  # Signup page
│   └── app/
│       ├── index.vue           # Dashboard
│       ├── subscriptions.vue   # Subscriptions list
│       ├── subscriptions/[id].vue  # Edit subscription
│       └── settings.vue        # Account settings
└── plugins/
    └── supabase.client.ts  # Supabase client initialization
```

## Features Overview

### Authentication

- Email/password registration and login
- Protected routes with middleware
- Session persistence
- Automatic redirect logic

### Dashboard

- Overview of active subscriptions
- Total monthly cost calculation
- Upcoming payments (next 30 days)
- Quick action buttons

### Subscription Management

- Create new subscriptions with form validation
- Edit existing subscriptions
- Delete subscriptions with confirmation
- Track multiple currencies
- Support for weekly, monthly, and yearly billing cycles

### UI/UX

- Clean, modern interface using Nuxt UI components
- Responsive design for mobile and desktop
- Loading states and error handling
- Form validation with Zod

## Available Scripts

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Type check
pnpm typecheck
```

## Environment Variables

| Variable            | Description                 |
| ------------------- | --------------------------- |
| `SUPABASE_URL`      | Your Supabase project URL   |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings
4. Deploy!

### Other Platforms

This is a standard Nuxt 4 application and can be deployed to any platform that supports Node.js:

- Netlify
- Cloudflare Pages
- AWS
- DigitalOcean

## Security Notes

- Row Level Security (RLS) is enabled on the Supabase database
- Users can only access their own subscriptions
- Authentication is handled securely by Supabase
- API keys are stored in environment variables

## Customization

### Styling

The app uses Tailwind CSS via Nuxt UI. Customize colors and styles in:

- `app.config.ts` - For Nuxt UI theme customization
- `assets/css/main.css` - For global CSS overrides

### Features

Add more features by:

1. Creating new pages in `app/pages/`
2. Adding composables for business logic
3. Extending the Supabase schema
4. Using Nuxt UI components from the [official docs](https://ui.nuxt.com)

## Troubleshooting

### Auth not working

- Verify your Supabase credentials in `.env`
- Check that RLS policies are properly set up
- Make sure email confirmation is disabled in Supabase (for development)

### Subscriptions not loading

- Verify the database table exists
- Check RLS policies
- Ensure user is authenticated

## Contributing

This is a template project. Feel free to fork and customize for your needs!

## License

MIT

## Support

For issues related to:

- **Nuxt**: [Nuxt Documentation](https://nuxt.com/docs)
- **Nuxt UI**: [Nuxt UI Documentation](https://ui.nuxt.com)
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)
