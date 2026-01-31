# SkillBridge Backend API

Connect with Expert Tutors - Backend API built with Node.js, Express, PostgreSQL, Better Auth, and Prisma.

## Tech Stack

- **Node.js + Express** - REST API
- **PostgreSQL + Prisma** - Database
- **Better Auth** - Authentication & Session Management
- **Zod** - Validation
- **TypeScript** - Type Safety

## Architecture

**Modular MVC Pattern:**
```
src/
├── modules/
│   ├── user/          # User profile management
│   ├── tutor/         # Tutor operations
│   ├── category/      # Subject categories
│   ├── booking/       # Session bookings
│   ├── review/        # Student reviews
│   └── admin/         # Admin operations
├── middleware/        # Auth, role, validation
└── lib/              # Shared utilities
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Update DATABASE_URL, BETTER_AUTH_SECRET, and BETTER_AUTH_URL
```

3. Set up database:
```bash
npx prisma generate
npx prisma db push
```

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication (Better Auth)
- `POST /api/auth/sign-up/email` - Register user
- `POST /api/auth/sign-in/email` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/auth/session` - Get current session

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Tutors
- `GET /api/tutors` - Get all tutors (with filters)
- `GET /api/tutors/:id` - Get tutor details
- `POST /api/tutors/profile` - Create tutor profile

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:userId` - Get user bookings
- `PATCH /api/bookings/:id/status` - Update booking status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/tutor/:tutorId` - Get tutor reviews

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id` - Update user status
- `GET /api/admin/bookings` - Get all bookings

## User Roles

- **STUDENT** - Browse tutors, book sessions, leave reviews
- **TUTOR** - Create profile, manage availability, view sessions
- **ADMIN** - Manage platform, view analytics, moderate content

## Database Schema

- **User** - Authentication and user info with roles
- **TutorProfile** - Tutor-specific data (linked to Users)
- **Category** - Subject categories
- **Booking** - Session bookings with status tracking
- **Review** - Student reviews for tutors
- **Session/Account/Verification** - Better Auth tables

## Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/skillbridge"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
```

## Scripts

- `npm run dev` - Start development server
- `npx prisma migrate dev` - Run migrations
- `npx prisma generate` - Generate Prisma client

## Features

✅ **Authentication** - Better Auth with email/password
✅ **Role-based Access** - Student, Tutor, Admin roles
✅ **Tutor Management** - Profiles, categories, ratings
✅ **Booking System** - Session scheduling and status tracking
✅ **Review System** - Student feedback and ratings
✅ **Admin Dashboard** - User management and analytics
✅ **Modular Architecture** - Clean MVC pattern
✅ **Type Safety** - Full TypeScript support
✅ **Validation** - Zod schema validation