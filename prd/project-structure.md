# Structure

## Monorepo App Structure

```plaintext
f1-penca-app/
├── app/
│   ├── layout.tsx             # Root layout (header/footer/globals)
│   ├── page.tsx               # Landing page (home)
│   ├── dashboard/
│   │   ├── layout.tsx         # Dashboard layout (user navigation)
│   │   └── page.tsx           # User Dashboard
│   ├── predictions/
│   │   └── page.tsx           # Create + View predictions
│   ├── admin/
│   │   ├── layout.tsx         # Admin layout (protected)
│   │   └── page.tsx           # Admin Dashboard
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts # NextAuth routes
│   │   └── predictions/route.ts       # API route for predictions CRUD
├── components/
│   ├── ui/                    # Generic UI components (buttons, cards, etc)
│   ├── navbar.tsx
│   ├── prediction-form.tsx
├── lib/
│   ├── prisma.ts              # Prisma Client helper
│   ├── auth.ts                # Authentication helper
│   └── api.ts                 # External API clients (openf1)
├── prisma/
│   └── schema.prisma          # Prisma schema
├── public/                    # Static assets (logos, images)
├── styles/                    # Global CSS (if needed)
├── types/
│   └── index.ts               # Shared TypeScript types
├── .env
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Database (Preliminary Entities)

- `User` (id, name, email, role)
- `Prediction` (id, userId, raceId, data)
- `Race` (id, season, round, type, date)
- `Leaderboard` (computed)

## API integration

- External: [openf1 API](https://openf1.org)
- Internal: Next.js API routes or server actions
