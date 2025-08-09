# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Anything Ipsum** is an Angular 20+ SSR application that generates AI-powered themed lorem ipsum text using the Mistral AI API. It's a modern web application built with standalone components, signals, and server-side rendering for optimal performance.

## Core Commands

### Development
```bash
npm start              # Start development server (ng serve with --open)
npm run dev           # Same as npm start
npm run build         # Build for development
npm run build:prod    # Build for production
npm run watch         # Build with watch mode
```

### Production & SSR
```bash
npm run start:prod    # Build and serve with SSR
npm run serve:ssr:anything-ipsum  # Serve pre-built SSR app
```

### Testing & Quality
```bash
npm test              # Run unit tests with Karma/Jasmine
npm run lint          # Run Angular linting
```

### Docker Deployment
```bash
docker-compose up --build    # Build and run containerized app
```

## Architecture Overview

### Frontend Architecture
- **Angular 20+** with standalone components (no NgModules)
- **Signals-based** reactive state management
- **Tailwind CSS v4** for styling with custom design tokens
- **Reactive Forms** with strict validation
- **SSR-optimized** for performance and SEO

### Backend/API Architecture
- **Express.js** server integrated with Angular SSR
- **Mistral AI integration** for content generation
- **Rate limiting** (50 requests per 15 minutes)
- **CORS** configuration for cross-origin requests
- **Environment-based** configuration with dotenv

### Key Components Structure
```
src/app/
├── app.ts                          # Root standalone component
├── components/
│   └── lorem-generator.component.ts # Main UI component with inline template
├── services/
│   └── lorem.service.ts            # HTTP service for API calls
├── models/
│   └── lorem.models.ts             # TypeScript interfaces
└── server.ts                       # Express server with API endpoints
```

### API Endpoints
- `GET /api/health` - Health check endpoint
- `POST /api/generate-lorem` - Generate themed lorem ipsum content

### Environment Variables Required
- `MISTRAL_API_KEY` - Mistral AI API key (required)
- `APP_URL` - Application URL (optional, defaults to localhost:4000)
- `NODE_ENV` - Environment mode (optional, defaults to production)
- `PORT` - Server port (optional, defaults to 4000)

## Code Patterns & Conventions

### Angular Patterns
- Use **standalone components** exclusively
- Leverage **signals** for reactive state management
- Implement **reactive forms** with proper validation
- Use **dependency injection** with `inject()` function
- Template uses **@if/@for** control flow syntax

### Styling Conventions
- **Tailwind CSS v4** with custom classes in app.css
- Responsive design with mobile-first approach
- Custom CSS variables for theming support
- Component-scoped styles when needed

### TypeScript Standards
- **Strict mode** enabled with comprehensive compiler options
- Use **type-only imports** where applicable
- Define interfaces for all API contracts
- Prefer `const` assertions and `readonly` modifiers

### API Integration
- Use **HttpClient** with proper typing
- Implement error handling with user-friendly messages
- Follow REST conventions for endpoints
- Rate limiting and CORS properly configured

## Development Notes

### State Management
The application uses Angular signals for state management. All component state (loading, results, errors) is managed through signals for optimal change detection performance.

### Form Validation
Forms use Angular reactive forms with custom validators. The main form validates theme input (required, min length) and numeric constraints on paragraph count.

### AI Integration
The backend integrates with Mistral AI's chat completions endpoint, using carefully crafted prompts to generate thematic lorem ipsum content with specific length requirements.

### Performance Optimizations
- SSR for faster initial load
- Tailwind CSS purging for minimal bundle size
- Angular build budgets enforced (500kB warning, 1MB error)
- Static asset caching with 1-year expiration

### Docker Configuration
The application includes production-ready Docker configuration with health checks and proper environment variable handling for deployment.