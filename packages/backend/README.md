# Run Mapper Backend API

A lightweight API server for the Run Mapper application, providing backend services with Firebase Admin integration.

## Getting Started

### Install Dependencies

```bash
yarn install
```

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

## Project Structure

- `src/index.ts` - Main server entry point
- `src/firebase/admin.ts` - Firebase Admin SDK setup
- `src/routes/` - API route handlers (to be added)

## Features

- Lightweight Hono framework
- Firebase Admin SDK integration
- CORS enabled
- TypeScript support
- Health check endpoint
