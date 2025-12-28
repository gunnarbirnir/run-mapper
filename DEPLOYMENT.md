# Vercel Deployment Guide

This guide walks you through deploying your TanStack Start app to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment

### 1. Push Your Code to Git

Make sure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Connect Your Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will auto-detect TanStack Start

### 3. Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset:** TanStack Start (auto-detected)
- **Build Command:** `yarn build`
- **Output Directory:** `.output/public` (auto-detected)
- **Install Command:** `yarn install`
- **Node.js Version:** 18.x or 20.x (recommended)

### 4. Environment Variables (if needed)

If you need environment variables (e.g., for Firebase later):

1. In the Vercel project settings, go to **Settings** → **Environment Variables**
2. Add your variables:
   - `NODE_ENV=production`
   - Add Firebase config variables when we set that up

### 5. Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Run the build command
   - Deploy your app
3. You'll get a URL like: `https://your-project.vercel.app`

### 6. Automatic Deployments

After the first deployment:
- Every push to `main`/`master` branch = Production deployment
- Every push to other branches = Preview deployment
- Pull requests = Preview deployment with unique URL

## Local Testing

Before deploying, test your production build locally:

```bash
yarn build
yarn start
```

Visit `http://localhost:3000` to verify everything works.

## Troubleshooting

### Build Fails

- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Serverless Function Errors

- Check that `src/server.tsx` is properly configured
- Verify TanStack Start plugin is in `vite.config.ts`

### 404 Errors

- Ensure routes are properly defined in `src/routes/`
- Check that `routeTree.gen.ts` is up to date (run `yarn dev` to regenerate)

## Next Steps

After successful deployment:
1. Set up Firebase (we'll do this next)
2. Configure custom domain (optional)
3. Set up environment variables for production
