# MoldScope

AI-powered mold analysis for DIY testing kits.

## Overview

MoldScope is a mobile-first application that enables users to analyze mold growth from petri dish samples using AI-powered image recognition. Users capture photos of their mold testing kit results and receive instant analysis including mold type identification, severity assessment, and health recommendations.

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 22 LTS or higher
- npm
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The database schema is located in `.agent-os/specs/2025-09-27-supabase-project-setup/supabase-migration.sql`

Run this SQL in your Supabase SQL Editor to create all required tables.

## Project Structure

```
mold-testing-kit/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Shared utilities
│   └── supabase/          # Supabase clients
│       ├── client.ts      # Client-side Supabase client
│       └── server.ts      # Server-side Supabase client
├── .agent-os/             # Agent OS project documentation
│   ├── product/           # Product mission, roadmap, decisions
│   └── specs/             # Feature specifications
└── .env.local             # Environment variables (not committed)
```

## Documentation

- [Product Mission](.agent-os/product/mission.md)
- [Tech Stack](.agent-os/product/tech-stack.md)
- [Roadmap](.agent-os/product/roadmap.md)
- [Deployment Guide](DEPLOYMENT.md)

## Development

```bash
# Run development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to Vercel.

## License

Private - All rights reserved