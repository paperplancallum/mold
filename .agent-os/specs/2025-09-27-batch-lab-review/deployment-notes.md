# Deployment Notes - Batch Lab Review System

## Required Environment Variables

Add these environment variables to your Vercel project:

### Production Environment
```
INTERNAL_API_KEY=2a3dc5e6ed6e5255f165bebbfcfbcb6382d125caa9991e6764c79d4543748e88
CRON_SECRET=b0647089e166cf03957239c1acd74d98e42a2cd82180410a2336bd51ec118cf6
NEXT_PUBLIC_SITE_URL=https://your-production-domain.vercel.app
```

### Local Development
Already configured in `.env.local`:
```
INTERNAL_API_KEY=2a3dc5e6ed6e5255f165bebbfcfbcb6382d125caa9991e6764c79d4543748e88
CRON_SECRET=b0647089e166cf03957239c1acd74d98e42a2cd82180410a2336bd51ec118cf6
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Vercel Cron Job Configuration

The `vercel.json` file configures a cron job that runs every 5 minutes:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-batches",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

**Important:** Vercel Cron Jobs require a **Pro plan** or higher. On the free Hobby plan, cron jobs will not execute.

## Testing the Cron Job

### Local Testing
```bash
curl -X GET http://localhost:3000/api/cron/process-batches \
  -H "Authorization: Bearer b0647089e166cf03957239c1acd74d98e42a2cd82180410a2336bd51ec118cf6"
```

### Production Testing
```bash
curl -X GET https://your-domain.vercel.app/api/cron/process-batches \
  -H "Authorization: Bearer b0647089e166cf03957239c1acd74d98e42a2cd82180410a2336bd51ec118cf6"
```

## Monitoring

View cron job executions in the Vercel dashboard:
1. Go to your project
2. Click "Cron Jobs" in the left sidebar
3. View execution logs and history

## Security Notes

- `INTERNAL_API_KEY` is used for server-to-server communication between cron job and analysis endpoint
- `CRON_SECRET` authenticates Vercel's cron service to your endpoint
- Both secrets should be kept secure and never committed to version control
- Rotate these secrets periodically in production