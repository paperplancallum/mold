# MoldScope Deployment Guide

## Vercel Deployment Configuration

### Required Environment Variables

Configure these in your Vercel project settings (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://tygwbhaxzpvgmvjeaukc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Z3diaGF4enB2Z212amVhdWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5Mzk4NjAsImV4cCI6MjA3NDUxNTg2MH0.5HE4VdixBocNq1Tue9iFdzIGJtyGtesGVfgS3AKBDEc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Z3diaGF4enB2Z212amVhdWtjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkzOTg2MCwiZXhwIjoyMDc0NTE1ODYwfQ.d7G5nr3CLw1hWBe8jMNanMkK78D6pOfKxh1bR57qXd8
```

### Deployment Checklist

#### Pre-Deployment

- [x] Supabase project created ("moldscope")
- [x] Email authentication enabled
- [x] Database schema deployed (users, tests, test_images, analysis_results)
- [ ] Storage bucket "petri-dish-images" created and configured
- [x] Local environment verified (`.env.local` configured)
- [ ] All tests passing
- [ ] GitHub repository created

#### Vercel Setup

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select the repository: `moldscope` or `mold-testing-kit`

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Add Environment Variables**
   - Copy the three environment variables listed above
   - Add each one in: Settings → Environment Variables
   - Apply to: Production, Preview, Development

4. **Configure Supabase Redirect URLs**
   - In Supabase dashboard: Authentication → URL Configuration
   - Add Production URL: `https://your-app.vercel.app/*`
   - Add Preview URLs: `https://*.vercel.app/*` (for PR previews)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Test deployment at your Vercel URL

#### Post-Deployment Verification

- [ ] Visit deployed URL
- [ ] Test API route: `https://your-app.vercel.app/api/test-connection`
- [ ] Verify Supabase connection works in production
- [ ] Check storage bucket access

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test connection
curl http://localhost:3000/api/test-connection

# Build for production
npm run build

# Run production build locally
npm start
```

### Troubleshooting

**Issue**: "Bucket not found" error
- **Solution**: Verify "petri-dish-images" bucket exists in Supabase Storage

**Issue**: Database connection fails
- **Solution**: Check environment variables are correctly set in Vercel

**Issue**: Authentication redirects fail
- **Solution**: Add Vercel domain to Supabase redirect URLs

### Production URLs

- **Supabase Project**: https://tygwbhaxzpvgmvjeaukc.supabase.co
- **Vercel Deployment**: TBD (after first deployment)