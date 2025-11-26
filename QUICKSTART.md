# Quick Start Guide

This guide will help you set up and run the Subscription Reminder App locally.

## Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm
- A Supabase account (free tier is fine)

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be fully initialized (this can take a few minutes)
3. Navigate to Project Settings > API
4. Copy your Project URL and anon/public key

## Step 3: Configure Environment Variables

Create a `.env` file in the root of your project:

```env
SUPABASE_URL=your-project-url-here
SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the placeholder values with your actual Supabase credentials.

## Step 4: Set Up the Database

1. Go to your Supabase project dashboard
2. Click on the SQL Editor tab in the sidebar
3. Create a new query
4. Copy and paste the following SQL:

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

-- Enable Row Level Security
alter table subscriptions enable row level security;

-- Create RLS policies
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

5. Click "Run" to execute the SQL

## Step 5: Configure Email Authentication (Optional but Recommended)

For development, you may want to disable email confirmation:

1. Go to Authentication > Settings in your Supabase dashboard
2. Scroll down to "Email Auth"
3. Disable "Confirm email" for easier testing
4. Click Save

**Note:** For production, keep email confirmation enabled!

## Step 6: Run the Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Step 7: Create Your First Account

1. Navigate to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Enter an email and password
4. Click "Create account"
5. You'll be redirected to the dashboard

## Step 8: Add Your First Subscription

1. From the dashboard, click "Add Subscription"
2. Fill in the subscription details:
   - Name: e.g., "Netflix"
   - Amount: e.g., 15.99
   - Currency: e.g., USD
   - Billing Cycle: Monthly
   - Next Billing Date: Select a date
   - Status: Active
3. Click "Add Subscription"

## Troubleshooting

### "Cannot connect to Supabase"

- Double-check your `.env` file has the correct credentials
- Make sure there are no extra spaces or quotes around the values
- Verify your Supabase project is fully initialized

### "Database error" when adding subscriptions

- Ensure you ran the SQL schema script in Supabase
- Check that Row Level Security policies are properly set up
- Verify you're logged in with a valid user account

### "Auth error" when signing up

- Check that email confirmation is disabled for development
- Try a different email address
- Check the Supabase Auth logs in your dashboard

### Port 3000 is already in use

```bash
# Use a different port
pnpm dev -- --port 3001
```

## What's Next?

- Explore the dashboard to see your subscription overview
- Add multiple subscriptions with different billing cycles
- Edit or delete subscriptions
- Check out the Settings page
- Customize the app to fit your needs!

## Development Tips

- Hot reload is enabled - changes will reflect immediately
- Check the browser console for any errors
- Use Vue DevTools for debugging components
- Refer to SETUP.md for detailed architecture information

## Getting Help

- [Nuxt Documentation](https://nuxt.com/docs)
- [Nuxt UI Documentation](https://ui.nuxt.com)
- [Supabase Documentation](https://supabase.com/docs)

Happy tracking! 🎉
