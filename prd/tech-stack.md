# F1 Penca - Technology Stack

## Frontend Architecture

### Core Framework
- **Next.js 14+**
  - Server-Side Rendering (SSR)
  - Static Site Generation (SSG)
  - API Routes for backend integration
  - Built-in optimization features

### Styling & UI
- **TailwindCSS 3+**
  - Utility-first CSS framework
  - Dark theme implementation
  - Responsive design utilities
  - Custom component styling
- **HeroUI (NextUI) 2+**
  - Modern React component library
  - Built on top of TailwindCSS
  - Pre-built accessible components
  - Consistent design system
  - Dark/light theme support
  - TypeScript-first approach
- **Heroicons** or **Lucide React**
  - Consistent icon system
  - SVG-based icons for performance

### Authentication
- **Fixed credentials**
  - Test users with fixed credentials for beta stage

### State Management
- **React State & Context**
  - Local component state
  - Context API for global state
  - Server state via API calls

## Backend Architecture

### API Layer
- **Next.js API Routes**
  - RESTful API endpoints
  - Server Actions for form handling
  - Middleware for authentication
  - Rate limiting implementation

### Database & ORM
- **PostgreSQL 15+**
  - Relational database for data integrity
  - Advanced querying capabilities
  - Full-text search support
  - JSON field support for flexible data

- **Prisma ORM 5+**
  - Type-safe database access
  - Database migrations
  - Query optimization
  - Schema management

### Database Hosting
- **Supabase**
  - Managed PostgreSQL hosting
  - Real-time subscriptions
  - Built-in authentication (backup)
  - Dashboard for database management

## External Services & APIs

### Data Sources
- **OpenF1 API**
  - Primary F1 data provider
  - Real-time race information
  - Driver and team data
  - Historical race results

## Development Tools

### Code Quality
- **TypeScript 5+**
  - Static type checking
  - Enhanced developer experience
  - Runtime error prevention
  - Better IDE support

- **ESLint**
  - Code linting and formatting
  - Next.js recommended rules
  - Custom project rules
  - Automatic error detection

- **Prettier**
  - Code formatting
  - Consistent code style
  - Integration with ESLint

### Development Environment
- **Node.js 18+**
  - JavaScript runtime
  - NPM package management
  - Development server

- **Git**
  - Version control
  - Branch management
  - Collaborative development

## Deployment & Infrastructure

### Hosting Platform
- **Vercel**
  - Seamless Next.js deployment
  - Automatic deployments from Git
  - Edge functions support
  - Built-in performance monitoring
  - Custom domain support

### Performance & Monitoring
- **Vercel Analytics**
  - Performance tracking
  - User behavior insights
  - Core Web Vitals monitoring

- **Vercel Speed Insights**
  - Real User Monitoring (RUM)
  - Performance optimization insights

## Security Considerations

### Data Protection
- **HTTPS Encryption**
  - TLS/SSL certificates
  - Secure data transmission
  - API endpoint protection

### Input Validation
- **Zod Schema Validation**
  - Runtime type checking
  - API input validation
  - Form data validation

### Environment Security
- **Environment Variables**
  - Secure credential storage
  - API key management
  - Configuration separation

## Testing Strategy (Future Implementation)

### Unit Testing
- **Jest**
  - Component testing
  - Utility function testing
  - Mocking capabilities

### Integration Testing
- **React Testing Library**
  - Component integration tests
  - User interaction testing
  - Accessibility testing

### End-to-End Testing
- **Playwright**
  - Full application testing
  - Cross-browser compatibility
  - User journey validation

## Package Management

### Core Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "prisma": "^5.0.0",
  "next-auth": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "@nextui-org/react": "^2.0.0",
  "@nextui-org/theme": "^2.0.0",
  "framer-motion": "^10.0.0",
  "typescript": "^5.0.0"
}
```

### Development Dependencies
```json
{
  "eslint": "^8.0.0",
  "prettier": "^3.0.0",
  "@types/node": "^20.0.0",
  "@types/react": "^18.0.0"
}
```

## Architecture Decisions

### Why Next.js?
- Full-stack React framework
- Excellent performance optimizations
- Strong TypeScript support
- Vercel deployment integration
- Large community and ecosystem

### Why HeroUI (NextUI)?
- Modern, accessible component library
- Built specifically for React and TypeScript
- Seamless TailwindCSS integration
- Consistent design system out of the box
- Excellent dark theme support
- High-quality animations with Framer Motion
- Reduces development time for UI components
- Active development and community support

### Why PostgreSQL + Prisma?
- ACID compliance for data integrity
- Complex query capabilities
- Type-safe database operations
- Excellent migration system
- Strong community support

### Why Supabase?
- Managed PostgreSQL service
- Built-in real-time features
- Competitive pricing
- Developer-friendly interface
- Backup and scaling options
