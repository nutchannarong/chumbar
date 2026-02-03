# Deploy Quick Start

## Local Development

```bash
cd vue-app
npm install
npm run dev
```

## Deploy to Vercel

### Option 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from vue-app directory)
cd vue-app
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Root Directory**: Leave empty (or set to `vue-app` if deploying from monorepo)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

### Option 3: Manual Deploy

```bash
cd vue-app
npm run build
vercel --prod
```

## Post-Deploy

After deployment, Vercel will give you a URL like:
```
https://your-project-name.vercel.app
```

## Environment Variables (Optional)

If you need to set environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables:
   - Name: `VITE_API_URL`
   - Value: Your Google Apps Script URL

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Auto-Deploy

When using GitHub integration:
- Push to `main` branch → Auto-deploys to production
- Push to other branches → Auto-deploys preview URLs

## Troubleshooting

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CORS Issues
Make sure your Google Apps Script has CORS headers:
```javascript
function doGet(e) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
```

### Preview Not Working
- Check Vercel build logs in dashboard
- Verify API URL is correct
- Test API endpoint separately

## Monitoring

View logs and analytics:
```
https://vercel.com/dashboard
```

## Redeploy

```bash
vercel --prod --force
```
