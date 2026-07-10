# CloudAxis

A standard React + Vite application for the CloudAxis enterprise infrastructure dashboard.

## Features

- Landing page and authentication flows
- Dashboard, alerts, analytics, reporting, inventory, and infrastructure pages
- Theme support, mock data, and toast notifications
- Clean Vite-based development workflow with TypeScript and Tailwind styling

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the development server
   ```bash
   npm run dev
   ```
3. Open the local URL shown by Vite (typically http://localhost:3000)

## Production build

```bash
npm run build
```

## Project structure

- src/main.tsx — Vite application entry point
- src/router.tsx — TanStack Router setup
- src/routes — route components for each page
- src/components — shared UI and app shell components
- src/lib — theme, auth, mock data, and utilities

## Environment variables

Copy .env.example to .env and adjust values as needed:

```bash
cp .env.example .env
```
