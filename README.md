# Cami & Brett Long Distance Love App 💕

A romantic pink cloud web app built with Next.js, Supabase, and Tailwind CSS for long-distance couples to stay connected through letters, shared calendars, and countdown timers.

## Features

- 🔐 **Email Magic Link Authentication** with allowlist for authorized users
- ⏰ **Dual Timezone Clocks** showing London & Los Angeles time with day/night indicators
- 📅 **Countdown Timer** to reunion date (editable, persists to database)
- 💌 **Love Letters** with real-time updates and archive
- 📅 **Shared Calendar** with joint events, timezone support, and ICS export
- 📞 **Call Requests** with time slot suggestions and real-time notifications
- 🎨 **Romantic Pink Cloud UI** with floating animations and sparkles

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **UI Components**: shadcn/ui, Radix UI, Framer Motion
- **Time Management**: Luxon for timezone handling
- **Testing**: Jest, Playwright
- **Fonts**: Geist Sans & Mono

## Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account and project
- Email addresses for the couple (currently: brett@example.com, cami@example.com)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd Brett-Cami-web-app
npm install
# or
pnpm install
```

### 2. Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database migrations**:
   - Go to your Supabase dashboard → SQL Editor
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Execute the migration

3. **Enable Realtime**:
   - Go to Database → Replication
   - Enable replication for `letters` and `call_requests` tables

4. **Get your Supabase credentials**:
   - Go to Settings → API
   - Copy your Project URL and anon public key

### 3. Environment Configuration

1. **Copy the environment template**:
   ```bash
   cp env.example .env.local
   ```

2. **Fill in your Supabase credentials** in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

   **Important**: Never commit `.env.local` to version control!

### 4. Email Allowlist Configuration

Edit the allowed emails in `contexts/AuthProvider.tsx`:

```typescript
const ALLOWED_EMAILS = [
  'brett@example.com',  // Replace with actual emails
  'cami@example.com'    // Replace with actual emails
]
```

### 5. Seed the Database (Optional)

Run the seed script to populate with sample data:

```bash
npm run seed
```

This will:
- Set reunion date to 7 days from now
- Create sample profiles
- Add a romantic letter
- Create a shared event

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

### Authentication
1. Visit the app - you'll see the sign-in page
2. Enter an authorized email address
3. Check your email for the magic link
4. Click the link to authenticate

### Features Overview

**Countdown Timer**: Shows time until reunion, editable by both users
**Dual Clocks**: Real-time clocks for London and Los Angeles with day/night icons
**Love Letters**: Send romantic messages with real-time delivery notifications
**Shared Calendar**: 
  - Joint Events: Visible to both users
  - Partner Events: Only visible to the other user
  - Month/Week/List views with infinite navigation
  - UTC storage with dual-timezone display
**Call Requests**: Propose video call times with automatic overlap suggestions

## Database Schema

The app uses the following main tables:

- `profiles`: User profiles (auto-created on signup)
- `app_settings`: Couple settings (reunion date)
- `letters`: Love letters between users
- `events`: Calendar events (shared/private)
- `call_requests`: Video call scheduling

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Testing

### Unit Tests
```bash
npm run test:unit
```

### E2E Tests
```bash
npm run test
```

**Note**: E2E tests require a running Supabase instance and may need authentication mocking for full functionality.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Customization

### Styling
- Edit `app/globals.css` for theme colors
- Modify `tailwind.config.js` for design tokens
- Update components in `components/` directory

### Email Allowlist
- Edit `ALLOWED_EMAILS` in `contexts/AuthProvider.tsx`

### Timezones
- Update `TIMEZONES` constant in `lib/time.ts`
- Modify clock components in `components/clock-cloud.tsx`

## Troubleshooting

### Common Issues

1. **404 errors for static assets**: Delete `.next` folder and restart dev server
2. **Font preload warnings**: Ensure only Geist fonts are imported in `layout.tsx`
3. **Radix ref warnings**: Check for double `asChild` props in components
4. **Hydration warnings**: Clock components are hydration-safe with loading states
5. **Supabase connection errors**: Verify environment variables and project URL

### Build Issues

If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is private and intended for personal use by Cami & Brett.

---

Built with ❤️ for long-distance love