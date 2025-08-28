# 🐸 Wedge & Wiffle - Toad Hollow Camp Game

A modern, mobile-friendly web app for tracking scores and rules for the Wedge & Wiffle lawn golf drinking game, presented by Toad Hollow camp.

## Features

- 📱 **Mobile-First Design**: Optimized for phones and tablets
- 🎯 **Interactive Scorecard**: Track 9-hole scores for multiple players
- ⚙️ **Customizable Par Values**: Edit and save par values for each hole
- 📋 **Complete Rules Reference**: All game mechanics in one place
- 🌊 **Waterfall Ceremony**: Automatic player ordering and timer
- 🔄 **Persistent Data**: Scores sync across all devices using Vercel Postgres
- 🎨 **Toad Hollow Branding**: Custom camp theming with toad imagery

## Game Rules Summary

**Wedge & Wiffle** is a lawn golf drinking game where players use wedges to hit wiffle balls toward targets across 9 holes. Features include:

- **Foiling**: Hit another player's ball to "Send" (free swing to pitch it anywhere) or "Burn" (return to tee)
- **Drinking Rules**: Penalties for overshooting, going out of bounds, or triple bogeys
- **Waterfall Ceremony**: After each hole, players drink in order from lowest to highest score

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Vercel Postgres with Prisma ORM
- **Deployment**: Vercel

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/carryologist/wedge---wiffle.git
   cd wedge---wiffle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your database URL.

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Vercel Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel Postgres**: Create a Postgres database in your Vercel dashboard

### Deployment Steps

1. **Connect your GitHub repository** to Vercel

2. **Create Vercel Postgres Database**:
   - In your Vercel dashboard, go to **Storage**
   - Click **Create Database** → **Postgres**
   - Name it `wedge-wiffle-db` (or any name you prefer)
   - Select your region and click **Create**

3. **Add environment variables** in your Vercel project settings:
   - Go to **Settings** → **Environment Variables**
   - Add: `DATABASE_URL` = (copy from your Vercel Postgres database settings)
   - The DATABASE_URL should look like: `postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb`

4. **Deploy**: 
   - Vercel will automatically build and deploy your app
   - The build process will run `prisma db push` to create database tables
   - If deployment fails, check the **Functions** tab for error logs

5. **Verify deployment**:
   - Visit your deployed app URL
   - Go to `/api/health` to check database connection
   - You should see: `{"status":"healthy","database":"connected","tables":"initialized"}`

6. **Troubleshooting**:
   - If buttons are missing, check Vercel **Functions** logs for errors
   - Ensure `DATABASE_URL` is correctly set in environment variables
   - Try redeploying from the **Deployments** tab

### Database Schema

The app uses three main tables that are automatically created:

- **Players**: Store player information and hole scores
- **GameState**: Track the current hole number  
- **CourseSetup**: Store custom par values for each hole

### Manual Database Setup (if needed)

If automatic setup fails, you can manually create tables in your Vercel Postgres dashboard:

```sql
-- Run this in your Vercel Postgres Query tab if tables don't auto-create
CREATE TABLE IF NOT EXISTS "players" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hole1" INTEGER NOT NULL DEFAULT 0,
    "hole2" INTEGER NOT NULL DEFAULT 0,
    "hole3" INTEGER NOT NULL DEFAULT 0,
    "hole4" INTEGER NOT NULL DEFAULT 0,
    "hole5" INTEGER NOT NULL DEFAULT 0,
    "hole6" INTEGER NOT NULL DEFAULT 0,
    "hole7" INTEGER NOT NULL DEFAULT 0,
    "hole8" INTEGER NOT NULL DEFAULT 0,
    "hole9" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "game_state" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "currentHole" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "game_state_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "course_setup" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "par1" INTEGER NOT NULL DEFAULT 4,
    "par2" INTEGER NOT NULL DEFAULT 4,
    "par3" INTEGER NOT NULL DEFAULT 4,
    "par4" INTEGER NOT NULL DEFAULT 4,
    "par5" INTEGER NOT NULL DEFAULT 4,
    "par6" INTEGER NOT NULL DEFAULT 4,
    "par7" INTEGER NOT NULL DEFAULT 4,
    "par8" INTEGER NOT NULL DEFAULT 4,
    "par9" INTEGER NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "course_setup_pkey" PRIMARY KEY ("id")
);
```

## API Endpoints

- `GET /api/players` - Fetch all players
- `POST /api/players` - Create a new player
- `DELETE /api/players` - Delete all players
- `DELETE /api/players/[id]` - Delete a specific player
- `PATCH /api/players/[id]` - Update player score
- `POST /api/scores/clear` - Clear all scores but keep players
- `GET /api/game-state` - Get current game state
- `PATCH /api/game-state` - Update current hole
- `GET /api/course-setup` - Get par values for all holes
- `PATCH /api/course-setup` - Update par values
- `POST /api/course-setup` - Reset all par values to 4

## Usage

1. **Add Players**: Use the "Add Player" button to add participants with custom colors
2. **Edit Par Values**: Click "Edit Par" to customize par values for each hole (1-10)
3. **Track Scores**: Enter scores for each hole in the interactive scorecard
4. **Waterfall Ceremony**: After each hole, use the Waterfall tab to see drinking order
5. **Clear Scores**: Reset scores for a new game while keeping players and par values
6. **Reset Game**: Remove all players and start fresh (par values are preserved)

## Contributing

This is a camp-specific app, but feel free to fork it for your own lawn games!

## License

MIT License - Feel free to adapt for your own camp or family games.

---

**Presented by 🐸 Toad Hollow 🐸**

*Drink responsibly and have fun!* 🍻🏌️‍♂️

<!-- Deployment trigger: Force Vercel to use latest commit 5ef2e2a -->