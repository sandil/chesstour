# Chess Tournaments

A Chess Tournament List page built with Next.js 15, React 19, and Tailwind CSS v4.

## Features

- **Tournament list** — displays name, time control, start time, players joined/max, and status
- **Dual filters** — filter by status (All / Upcoming / Ongoing / Full) and by time control (All / Blitz / Rapid / Classical); filters compose together
- **Join interaction** — mocked join: clicking Register/Join Now increments the player count optimistically and disables the button with a "Joined ✓" state; when a tournament reaches capacity the button becomes "Registration Closed" (disabled)
- **Full state** — derived at runtime from `playersJoined >= maxPlayers`, so joining a near-full tournament can flip it to Full and remove it from non-Full filtered views

## Data approach

The tournament data lives in `app/data/tournaments.ts` as a typed TypeScript `const` rather than a raw JSON import. This avoids enabling `resolveJsonModule` in `tsconfig.json` and keeps the data co-located with its TypeScript types (`Tournament`, `TimeControl`, `TournamentStatus`). The shape is identical to the provided `tournament.json`.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
