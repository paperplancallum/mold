# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-28-homepage-redesign/spec.md

> Created: 2025-09-28
> Version: 1.0.0

## Technical Requirements

### Page Structure

- Replace current empty homepage (`app/page.tsx`) with new landing page component
- Use Next.js 15 App Router with TypeScript
- Implement as client component for interactive elements (navigation menu, mobile toggle)
- No authentication required to view homepage
- Fast initial load with optimized images and minimal JavaScript

### Navigation Bar Component

- Fixed header with logo, navigation links, and authentication CTAs
- Responsive hamburger menu for mobile devices (< 768px)
- Navigation links: Logo (links to `/`), "About", "How It Works" (smooth scroll anchors)
- Authentication buttons: "Login" and "Register" with equal visual weight
- Sticky navigation that remains visible on scroll
- Mobile menu overlay with slide-in animation
- Use Tailwind CSS for styling with existing color scheme
- Lucide React icons for hamburger menu (Menu, X icons)

### Hero Section

**Layout:**
- Full-width section with gradient or subtle background
- Centered content with max-width container (max-w-7xl)
- Two-column layout on desktop, stacked on mobile
- Left column: Headline, subheadline, benefits list, CTAs
- Right column: Hero image or illustration placeholder

**Content Elements:**
- **Headline**: Large, bold text (text-4xl md:text-6xl) - "Instant AI-Powered Mold Analysis"
- **Subheadline**: Supporting text (text-xl) - "Get professional-grade mold identification in under 60 seconds. No lab required."
- **Benefits List**: 3-4 key benefits with checkmark icons
  - "Results in under 60 seconds"
  - "Save $50-200 vs lab testing"
  - "AI-powered analysis"
  - "Health recommendations included"
- **CTAs**: Two buttons with equal prominence
  - "Get Started" (primary blue button) → links to `/register`
  - "Login" (secondary outline button) → links to `/login`
- Use Lucide React icons: CheckCircle for benefits list

### How It Works Section

**Layout:**
- Three-column layout on desktop, single column on mobile
- Each step is a card with icon, title, and description
- Numbered steps (1, 2, 3) or use circular badges
- Vertical spacing between sections (py-16 md:py-24)

**Content:**
1. **Step 1: Upload Photo**
   - Icon: Camera or Upload icon (Lucide React)
   - Title: "Take or Upload Photo"
   - Description: "Capture a photo of your mold testing kit sample using your phone camera or upload an existing image."

2. **Step 2: AI Analysis**
   - Icon: Sparkles or Brain icon
   - Title: "Get Instant Analysis"
   - Description: "Our AI analyzes your sample in under 60 seconds, identifying mold types and assessing severity levels."

3. **Step 3: Recommendations**
   - Icon: FileText or List icon
   - Title: "Follow Recommendations"
   - Description: "Receive personalized health recommendations and actionable remediation guidance based on your results."

### Trust & Social Proof Section

**Layout:**
- Multiple subsections within one container
- Background color alternation for visual separation

**Sample Results Display:**
- Card showing anonymized test result example
- Includes: sample image thumbnail, severity badge, brief analysis snippet
- "View Sample Report" link to demonstrate output quality
- Use existing badge styling from test results page

**Trust Badges:**
- Three badges in a row (responsive grid)
- Badge 1: "60-Second Results" with Clock icon
- Badge 2: "Save $50-200" with DollarSign icon
- Badge 3: "AI-Powered" with Sparkles icon
- Clean card design with icon, number/text, and description

**Testimonials:**
- 2-3 testimonial cards in grid layout
- Each card: quote text, customer name (first name only), use case
- Example: "Saved me a trip to the expensive lab. Results were instant and easy to understand." - Sarah, Homeowner
- Use subtle shadow and rounded corners for cards

### Responsive Design Requirements

**Breakpoints (Tailwind defaults):**
- Mobile: < 640px (sm)
- Tablet: 640px - 768px (md)
- Desktop: > 768px (lg, xl)

**Mobile Optimizations:**
- Hamburger menu for navigation
- Stacked layouts for hero and how-it-works sections
- Touch-friendly button sizes (min 44x44px)
- Optimized font sizes for readability
- Single column for trust badges and testimonials

**Desktop Enhancements:**
- Multi-column layouts for content sections
- Larger imagery and more whitespace
- Hover states on buttons and links
- Smooth scroll behavior for anchor links

### Performance Optimization

- Use Next.js Image component for all images with proper sizing
- Lazy load below-the-fold content (trust section)
- Minimize initial JavaScript bundle
- Inline critical CSS for above-the-fold content
- Optimize Google Fonts loading with Next.js font optimization
- Target Lighthouse score: > 90 on mobile

### Styling Standards

- Follow existing Tailwind CSS patterns from dashboard
- Use consistent color scheme: blue primary, gray neutrals, green/yellow/red for severity
- Maintain existing font family (Inter via Google Fonts)
- Use existing spacing scale (Tailwind defaults)
- Ensure WCAG AA accessibility standards for color contrast
- Add focus states for keyboard navigation

### Integration Points

- Navigation "Login" button → links to `/login` (existing auth flow)
- Navigation "Register" button → links to `/register` (existing auth flow)
- Hero CTAs → same destinations as navigation auth buttons
- Smooth scroll implementation for anchor links (About, How It Works)
- No API calls required for static content
- SEO meta tags: title, description, og:image for social sharing

## Approach

The homepage will be implemented as a single-page component with multiple sections, each following mobile-first responsive design principles. We'll use existing Tailwind CSS patterns and components from the current dashboard for consistency. Static content will be hardcoded initially (no CMS), with placeholder images that can be replaced with actual assets later. The focus is on clean, fast-loading design that clearly communicates value and provides friction-free access to authentication flows.

## External Dependencies

No new external dependencies required. All functionality uses existing stack:
- Next.js 15 for page routing and optimization
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React for icons (already in use)
- Next.js Image component for optimized images