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

2. **Add environment variables** in your Vercel project settings:
   ```
   DATABASE_URL=your_vercel_postgres_connection_string
   ```

3. **Deploy**: Vercel will automatically build and deploy your app

4. **Initialize the database**: After deployment, run:
   ```bash
   npx prisma db push
   ```
   Or use the Vercel CLI:
   ```bash
   vercel env pull .env.local
   npm run db:push
   ```

### Database Schema

The app uses two main tables:

- **Players**: Store player information and hole scores
- **GameState**: Track the current hole number

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