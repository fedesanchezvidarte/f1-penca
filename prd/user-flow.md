# F1 Penca - User Flow Documentation

## Primary User Flows

### 1. New User Registration & First Prediction

```mermaid
graph TD
    A[Visitor arrives at homepage] --> B[Click 'Sign In with Google']
    B --> C[Google OAuth consent screen]
    C --> D[Google authentication]
    D --> E[Account creation in database]
    E --> F[Welcome to dashboard]
    F --> G[View current race schedule]
    G --> H[Click 'Make Prediction']
    H --> I[Prediction form with current race]
    I --> J[Select drivers for each position]
    J --> K[Submit prediction]
    K --> L[Confirmation message]
    L --> M[Redirect to leaderboard]
```

### 2. Returning User - Making Predictions

```mermaid
graph TD
    A[User visits site] --> B[Already authenticated?]
    B -->|Yes| C[Dashboard view]
    B -->|No| D[Sign in with Google]
    D --> C
    C --> E[View upcoming races]
    E --> F[Select race to predict]
    F --> G[Check if prediction exists]
    G -->|No| H[Create new prediction]
    G -->|Yes| I[Edit existing prediction]
    H --> J[Fill prediction form]
    I --> J
    J --> K[Validate selections]
    K -->|Valid| L[Save prediction]
    K -->|Invalid| M[Show validation errors]
    M --> J
    L --> N[Success confirmation]
    N --> O[View updated leaderboard]
```

### 3. Leaderboard Viewing & Analysis

```mermaid
graph TD
    A[User accesses leaderboard] --> B[Default view: Current season]
    B --> C[User interaction options]
    C --> D[Filter by race]
    C --> E[Filter by time period]
    C --> F[Search for specific user]
    C --> G[View detailed scores]
    D --> H[Race-specific rankings]
    E --> I[Custom period rankings]
    F --> J[User profile view]
    G --> K[Score breakdown modal]
    H --> L[Export or share results]
    I --> L
    J --> L
    K --> L
```

### 4. Admin User Management

```mermaid
graph TD
    A[Admin login] --> B[Admin dashboard]
    B --> C[User management section]
    C --> D[View all users]
    D --> E[Select user action]
    E --> F[View user details]
    E --> G[Suspend user account]
    E --> H[Delete user account]
    E --> I[Reset user password]
    F --> J[User activity history]
    G --> K[Confirmation dialog]
    H --> L[Data deletion warning]
    I --> M[Send reset email]
    K --> N[Execute action]
    L --> N
    M --> N
    N --> O[Update user status]
    O --> P[Refresh user list]
```

## Detailed User Journeys

### First-Time User Experience

**Phase 1: Discovery & Registration**
1. User discovers F1 Penca through social media/friend referral
2. Lands on homepage with clear value proposition
3. Sees current F1 season information and sample leaderboard
4. Clicks "Get Started" or "Sign In with Google"
5. Completes Google OAuth flow
6. System creates user account automatically
7. User sees personalized welcome message

**Phase 2: Onboarding & First Prediction**
1. User guided to dashboard with tutorial tooltips
2. Current race weekend highlighted prominently
3. "Make Your First Prediction" call-to-action
4. Prediction form opens with helper text
5. User selects drivers for each position
6. Form validates selections in real-time
7. User submits first prediction successfully
8. Celebration animation and achievement unlock

**Phase 3: Engagement & Discovery**
1. User redirected to leaderboard view
2. Sees their position among other users
3. Discovers scoring system explanation
4. Explores historical race data
5. Checks upcoming race schedule
6. Sets up notification preferences

### Regular User Experience

**Pre-Race Preparation**
1. User receives notification about upcoming race
2. Logs in to check current predictions
3. Reviews race information and recent form
4. Adjusts predictions based on new information
5. Confirms final selections before lockout

**Post-Race Analysis**
1. User receives race completion notification
2. Checks updated scores and leaderboard position
3. Analyzes prediction accuracy
4. Views detailed scoring breakdown
5. Compares performance with friends
6. Prepares for next race predictions

### Admin User Experience

**Daily Administration**
1. Admin reviews system health dashboard
2. Checks for user reports or issues
3. Monitors data synchronization status
4. Reviews recent user activity patterns

**User Management Tasks**
1. Investigates reported user behavior
2. Reviews user's prediction history
3. Makes moderation decisions
4. Implements account actions as needed
5. Documents decisions for audit trail

**Data Management Tasks**
1. Monitors F1 data feed accuracy
2. Resolves data conflicts when they arise
3. Manually updates race results if needed
4. Verifies scoring calculations

## Error Handling Flows

### Authentication Failures

```mermaid
graph TD
    A[User attempts sign-in] --> B[Google OAuth call]
    B --> C[OAuth response]
    C -->|Success| D[Create/update user session]
    C -->|Failure| E[Display error message]
    E --> F[Offer retry option]
    F --> G[Contact support option]
    D --> H[Redirect to dashboard]
```

### Prediction Submission Errors

```mermaid
graph TD
    A[User submits prediction] --> B[Validate input]
    B -->|Valid| C[Check lockout time]
    B -->|Invalid| D[Show validation errors]
    C -->|Before lockout| E[Save to database]
    C -->|After lockout| F[Show lockout message]
    E -->|Success| G[Show success message]
    E -->|Database error| H[Show retry option]
    D --> I[Highlight problematic fields]
    F --> J[Redirect to leaderboard]
    H --> K[Log error for admin review]
```

### Data Synchronization Issues

```mermaid
graph TD
    A[Scheduled data sync] --> B[Fetch from OpenF1 API]
    B -->|Success| C[Validate data integrity]
    B -->|API failure| D[Log error]
    C -->|Valid| E[Update database]
    C -->|Invalid| F[Alert administrators]
    D --> G[Use cached data]
    E --> H[Recalculate scores]
    F --> I[Manual intervention required]
    G --> J[Display data freshness warning]
```

## Mobile User Experience

### Mobile-Specific Flows

**Touch-Optimized Prediction Making**
1. User opens app on mobile device
2. Sees mobile-optimized dashboard layout
3. Taps on current race card
4. Swipes through prediction categories
5. Uses dropdown selectors optimized for touch
6. Confirms predictions with large touch targets

**Mobile Navigation Patterns**
1. Bottom navigation bar for main sections
2. Swipe gestures for leaderboard filtering
3. Pull-to-refresh for data updates
4. Touch-friendly form controls

## Performance Considerations

### Optimized Loading Flows

**Progressive Data Loading**
1. Critical content loads first (current user data)
2. Leaderboard data loads progressively
3. Historical data loads on demand
4. Images and media lazy-load

**Offline Capability**
1. Core prediction data cached locally
2. Offline predictions saved temporarily
3. Sync when connection restored
4. Clear indicators of offline status

## Accessibility Flows

### Screen Reader Support

**Keyboard Navigation Paths**
1. Logical tab order through prediction forms
2. Skip links for main content areas
3. ARIA labels for complex interactions
4. Clear focus indicators throughout

**Voice Control Support**
1. Voice commands for common actions
2. Audio feedback for score updates
3. Screen reader announcements for dynamic content
4. Alternative navigation for motor impairments
