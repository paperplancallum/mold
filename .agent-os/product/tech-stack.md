# Technical Stack

## Application Framework
- **Framework:** Next.js 15 (latest stable)
- **Language:** TypeScript
- **Node Version:** 22 LTS
- **Package Manager:** npm

## Frontend
- **CSS Framework:** Tailwind CSS latest
- **UI Component Library:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React components
- **Font Provider:** Google Fonts
- **Font Loading:** Next.js font optimization

## Backend & Database
- **Primary Database:** Supabase (PostgreSQL)
- **ORM/Client:** Supabase Client
- **Authentication:** Supabase Auth
- **Database Hosting:** Supabase
- **Database Backups:** Automated via Supabase

## AI & Image Processing
- **AI Platform:** OpenAI GPT-4 Vision API
- **Image Storage:** Supabase Storage
- **Image Processing:** Sharp (via Next.js)

## Hosting & Deployment
- **Application Hosting:** Vercel
- **Asset Hosting:** Vercel CDN / Supabase Storage
- **Deployment Solution:** Vercel (automatic deployments)
- **CI/CD Platform:** Vercel
- **CI/CD Trigger:** Push to main/preview branches
- **Production Environment:** main branch
- **Preview Environment:** Feature branches
- **Tests:** Run before deployment

## External Services
- **Email Service:** Resend
- **Version Control:** GitHub
- **Code Repository URL:** TBD (to be provided)

## Mobile Considerations
- **Responsive Design:** Mobile-first Tailwind CSS
- **Camera Access:** Browser Media API (getUserMedia)
- **PWA Support:** Next.js PWA capabilities (optional future enhancement)
- **Image Capture:** Native device camera via HTML5 Media Capture