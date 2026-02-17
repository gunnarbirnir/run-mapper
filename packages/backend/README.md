# Run Mapper Backend API

A lightweight API server for the Run Mapper application, providing backend services with Firebase Admin integration.

## Getting Started

### Install Dependencies

```bash
yarn install
```

### Firebase Setup

1. Create a `.env` file in the `packages/backend` directory with your Firebase credentials:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

2. To get your Firebase credentials:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Copy the `project_id`, `client_email`, and `private_key` values

3. Make sure your `.env` file is in `.gitignore` (it should be by default)

### Development

```bash
yarn dev
```

The API server will be available at `http://localhost:3001`

### Build

```bash
yarn build
```

### Production

```bash
yarn start
```

### Cloud Functions (2nd gen)

- Firebase Functions entrypoint: `src/functions.ts`
- Exported HTTPS function: `api`
- Set `CORS_ALLOWED_ORIGINS` to your Vercel app domains (comma-separated)
- On Google Cloud, Firebase Admin uses default runtime credentials automatically
- Cost-focused defaults:
  - `maxInstances=1`
  - `minInstances=0`
  - `memory=128MiB`
  - `timeoutSeconds=15`

Deploy from repo root:

```bash
firebase deploy --only functions:api
```

Set runtime env vars for Functions 2nd gen in `packages/backend/.env.run-mapper-3780b`:

```bash
CORS_ALLOWED_ORIGINS=https://run-mapper-ten.vercel.app,https://runmapper.fit
FUNCTION_MAX_INSTANCES=1
FUNCTION_TIMEOUT_SECONDS=15
# Optional stricter auth (adds extra Firebase auth check per request):
# AUTH_CHECK_REVOKED=true
```

Firebase CLI will load that env file during deploy for the `run-mapper-3780b` project.

## API Endpoints

### Health Check

- `GET /health` - Check server and Firebase connection status

### Runs

- `GET /runs` - List all runs
- `GET /runs/:id` - Get a specific run
- `POST /runs` - Create a new run
  ```json
  {
    "name": "Morning Run",
    "routeData": {
      /* GeoJSON FeatureCollection */
    }
  }
  ```

## Project Structure

- `src/index.ts` - Main server entry point
- `src/firebase/admin.ts` - Firebase Admin SDK setup
- `src/routes/runs.ts` - Run CRUD endpoints

## Features

- Lightweight Hono framework
- Firebase Admin SDK integration
- Firestore database operations
- CORS enabled
- TypeScript support
- Health check endpoint with Firebase connection test
