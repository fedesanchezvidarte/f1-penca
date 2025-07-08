# F1 Penca - Project Structure & Architecture

## Application Architecture Overview

### Technology Stack Layer Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  Next.js 14 + React 18 + TypeScript + TailwindCSS         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Authentication Layer                       │
│              NextAuth.js + Google OAuth                     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     API Layer                               │
│        Next.js API Routes + Server Actions                  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic                            │
│           Services + Utilities + Validation                 │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│              Prisma ORM + PostgreSQL                        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  External Services                          │
│     OpenF1 API + Supabase + Vercel + Google OAuth          │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

### Root Level Configuration
```
f1-penca/
├── .env.local                 # Environment variables (local)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.mjs      # TailwindCSS configuration
├── postcss.config.mjs       # PostCSS configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # Dependency lock file
├── README.md                # Project documentation
├── CONTRIBUTING.md          # Contribution guidelines
└── LICENSE                  # Project license
```

### Source Code Structure

#### App Directory (Next.js 14 App Router)
```
src/app/
├── layout.tsx               # Root application layout
├── page.tsx                 # Homepage/landing page
├── globals.css              # Global CSS styles
├── loading.tsx              # Global loading component
├── error.tsx                # Global error boundary
├── not-found.tsx           # 404 page
│
├── (auth)/                  # Route group for auth pages
│   ├── login/
│   │   └── page.tsx         # Login page
│   └── logout/
│       └── page.tsx         # Logout confirmation
│
├── dashboard/               # User dashboard routes
│   ├── layout.tsx           # Dashboard layout
│   ├── page.tsx             # Dashboard homepage
│   ├── loading.tsx          # Dashboard loading state
│   └── profile/
│       ├── page.tsx         # User profile page
│       └── edit/
│           └── page.tsx     # Profile editing
│
├── predictions/             # Prediction management
│   ├── layout.tsx           # Predictions layout
│   ├── page.tsx             # Predictions list
│   ├── create/
│   │   └── page.tsx         # Create prediction
│   ├── [id]/
│   │   ├── page.tsx         # View prediction
│   │   └── edit/
│   │       └── page.tsx     # Edit prediction
│   └── race/
│       └── [raceId]/
│           └── page.tsx     # Race-specific predictions
│
├── leaderboard/             # Leaderboard and rankings
│   ├── layout.tsx           # Leaderboard layout
│   ├── page.tsx             # Main leaderboard
│   ├── race/
│   │   └── [raceId]/
│   │       └── page.tsx     # Race-specific leaderboard
│   └── season/
│       └── [year]/
│           └── page.tsx     # Season leaderboard
│
├── admin/                   # Admin panel (protected)
│   ├── layout.tsx           # Admin layout
│   ├── page.tsx             # Admin dashboard
│   ├── users/
│   │   ├── page.tsx         # User management
│   │   └── [id]/
│   │       └── page.tsx     # User details
│   ├── races/
│   │   ├── page.tsx         # Race management
│   │   └── [id]/
│   │       └── page.tsx     # Race details
│   └── system/
│       └── page.tsx         # System monitoring
│
└── api/                     # API routes
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts     # NextAuth configuration
    ├── users/
    │   ├── route.ts         # User CRUD operations
    │   └── [id]/
    │       └── route.ts     # Specific user operations
    ├── predictions/
    │   ├── route.ts         # Prediction CRUD
    │   └── [id]/
    │       └── route.ts     # Specific prediction ops
    ├── races/
    │   ├── route.ts         # Race data endpoints
    │   └── [id]/
    │       └── route.ts     # Specific race data
    ├── leaderboard/
    │   └── route.ts         # Leaderboard calculations
    ├── admin/
    │   ├── users/
    │   │   └── route.ts     # Admin user management
    │   └── system/
    │       └── route.ts     # System admin endpoints
    └── sync/
        └── f1-data/
            └── route.ts     # F1 data synchronization
```

#### Components Directory
```
src/components/
├── ui/                      # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── modal.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── table.tsx
│   ├── pagination.tsx
│   ├── loading-spinner.tsx
│   ├── error-message.tsx
│   └── toast.tsx
│
├── layout/                  # Layout components
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   ├── footer.tsx
│   ├── header.tsx
│   └── mobile-nav.tsx
│
├── auth/                    # Authentication components
│   ├── auth-provider.tsx
│   ├── login-form.tsx
│   ├── logout-button.tsx
│   ├── auth-guard.tsx
│   └── role-guard.tsx
│
├── predictions/             # Prediction-related components
│   ├── prediction-form.tsx
│   ├── prediction-card.tsx
│   ├── prediction-list.tsx
│   ├── driver-selector.tsx
│   ├── position-selector.tsx
│   └── prediction-summary.tsx
│
├── leaderboard/            # Leaderboard components
│   ├── leaderboard-table.tsx
│   ├── leaderboard-filters.tsx
│   ├── user-ranking.tsx
│   ├── score-breakdown.tsx
│   └── position-change.tsx
│
├── admin/                  # Admin panel components
│   ├── admin-navbar.tsx
│   ├── user-management.tsx
│   ├── race-management.tsx
│   ├── system-stats.tsx
│   └── audit-log.tsx
│
├── dashboard/              # Dashboard components
│   ├── stats-card.tsx
│   ├── recent-predictions.tsx
│   ├── upcoming-races.tsx
│   └── user-progress.tsx
│
└── forms/                  # Form components
    ├── form-wrapper.tsx
    ├── form-field.tsx
    ├── form-error.tsx
    ├── form-success.tsx
    └── validation-message.tsx
```

#### Library Directory
```
src/lib/
├── auth/                   # Authentication utilities
│   ├── auth.ts            # NextAuth configuration
│   ├── auth-utils.ts      # Auth helper functions
│   ├── session.ts         # Session management
│   └── permissions.ts     # Role-based permissions
│
├── database/              # Database utilities
│   ├── prisma.ts          # Prisma client instance
│   ├── connection.ts      # Database connection
│   ├── migrations.ts      # Migration utilities
│   └── seed.ts            # Database seeding
│
├── api/                   # External API clients
│   ├── openf1.ts          # OpenF1 API client
│   ├── api-client.ts      # Generic API client
│   ├── error-handler.ts   # API error handling
│   └── rate-limiter.ts    # Rate limiting utilities
│
├── validation/            # Input validation
│   ├── schemas.ts         # Zod validation schemas
│   ├── prediction.ts      # Prediction validation
│   ├── user.ts            # User validation
│   └── race.ts            # Race validation
│
├── utils/                 # Utility functions
│   ├── date.ts            # Date utilities
│   ├── formatting.ts      # Data formatting
│   ├── constants.ts       # Application constants
│   ├── helpers.ts         # General helpers
│   └── scoring.ts         # Scoring calculations
│
└── hooks/                 # Custom React hooks
    ├── use-auth.ts        # Authentication hook
    ├── use-predictions.ts # Predictions data hook
    ├── use-leaderboard.ts # Leaderboard data hook
    ├── use-debounce.ts    # Debounce hook
    └── use-local-storage.ts # Local storage hook
```

#### Services Directory
```
src/services/
├── auth-service.ts         # Authentication business logic
├── prediction-service.ts   # Prediction business logic
├── leaderboard-service.ts  # Leaderboard calculations
├── race-service.ts         # Race data management
├── user-service.ts         # User management
├── scoring-service.ts      # Scoring algorithm
├── notification-service.ts # Notification handling
└── sync-service.ts         # Data synchronization
```

#### Types Directory
```
src/types/
├── auth.ts                # Authentication types
├── prediction.ts          # Prediction types
├── race.ts               # Race and F1 data types
├── user.ts               # User types
├── leaderboard.ts        # Leaderboard types
├── api.ts                # API response types
├── database.ts           # Database types
└── global.ts             # Global type definitions
```

### Database Structure (Prisma)
```
prisma/
├── schema.prisma          # Main database schema
├── migrations/            # Database migrations
│   ├── migration_lock.toml
│   └── [timestamp]_[name]/
│       └── migration.sql
└── seed.ts               # Database seeding script
```

### Public Assets
```
public/
├── images/               # Static images
│   ├── logo/
│   ├── flags/           # Country flags
│   ├── drivers/         # Driver photos
│   └── teams/           # Team logos
├── icons/               # Icon files
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── manifest-icons/
└── data/                # Static data files
    ├── circuits.json
    └── fallback-data.json
```

### Documentation
```
docs/
├── api/                 # API documentation
├── deployment/          # Deployment guides
├── development/         # Development setup
├── user-guide/         # User documentation
└── troubleshooting/    # Common issues
```

### Configuration Files
```
config/
├── database.ts         # Database configuration
├── auth.ts            # Auth configuration
├── api.ts             # API configuration
└── monitoring.ts      # Monitoring setup
```

## Database Schema Design

### Core Entities

#### User Entity
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  image       String?
  role        Role     @default(USER)
  totalPoints Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  predictions Prediction[]
  
  @@map("users")
}
```

#### Race Entity
```prisma
model Race {
  id           String    @id @default(cuid())
  season       Int
  round        Int
  name         String
  circuit      String
  date         DateTime
  qualiDate    DateTime?
  sprintDate   DateTime?
  status       RaceStatus @default(SCHEDULED)
  
  predictions  Prediction[]
  results      RaceResult[]
  
  @@unique([season, round])
  @@map("races")
}
```

#### Prediction Entity
```prisma
model Prediction {
  id            String   @id @default(cuid())
  userId        String
  raceId        String
  polePosition  String?
  raceWinner    String?
  secondPlace   String?
  thirdPlace    String?
  topTenDrivers Json?
  sprintWinner  String?
  isLocked      Boolean  @default(false)
  points        Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
  race Race @relation(fields: [raceId], references: [id])
  
  @@unique([userId, raceId])
  @@map("predictions")
}
```

## API Architecture

### RESTful API Design

#### Endpoint Structure
```
/api/v1/
├── auth/
│   ├── GET    /session     # Get current session
│   ├── POST   /login       # Login user
│   └── POST   /logout      # Logout user
├── users/
│   ├── GET    /            # List users (admin)
│   ├── GET    /:id         # Get user details
│   ├── PUT    /:id         # Update user
│   └── DELETE /:id         # Delete user (admin)
├── predictions/
│   ├── GET    /            # List user predictions
│   ├── POST   /            # Create prediction
│   ├── GET    /:id         # Get prediction details
│   ├── PUT    /:id         # Update prediction
│   └── DELETE /:id         # Delete prediction
├── races/
│   ├── GET    /            # List races
│   ├── GET    /:id         # Get race details
│   ├── GET    /current     # Get current race
│   └── GET    /upcoming    # Get upcoming races
├── leaderboard/
│   ├── GET    /overall     # Overall leaderboard
│   ├── GET    /race/:id    # Race leaderboard
│   └── GET    /user/:id    # User standings
└── admin/
    ├── GET    /dashboard   # Admin dashboard data
    ├── POST   /sync        # Manual data sync
    └── GET    /audit       # Audit logs
```

### Error Handling Strategy

#### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

#### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Security Architecture

### Authentication Flow
1. User clicks "Sign in with Google"
2. Redirect to Google OAuth consent screen
3. Google returns authorization code
4. Exchange code for access token
5. Fetch user profile from Google
6. Create/update user in database
7. Generate JWT session token
8. Set secure HTTP-only cookie

### Authorization Levels
- **Public**: Accessible without authentication
- **User**: Requires valid user session
- **Admin**: Requires admin role
- **Owner**: User can only access their own data

### Data Protection
- All sensitive data encrypted at rest
- HTTPS enforced in production
- Input validation on all endpoints
- Rate limiting to prevent abuse
- CSRF protection enabled
- SQL injection prevention via Prisma
