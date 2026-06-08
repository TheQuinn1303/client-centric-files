# Deployment Guide

This project is a server-rendered React app with Supabase integration. The app now builds with Nitro using the `node-server` preset and can run on any Node-compatible host.

## What changed

- `vite.config.ts` now forces `nitro: { preset: "node-server" }`.
- `package.json` scripts now use `vite.config.ts` explicitly for build/dev/preview.
- `npm start` now runs the built Nitro server from `.output/server/index.mjs`.
- `Dockerfile` and `.dockerignore` were added for container deployment.

## Local commands

```bash
npm install
npm run dev
npm run build
npm start
```

The app will start on port `3000` by default, or on `PORT` if set.

## Environment variables

Do not commit `.env` to your repo. Set these variables in your deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

If your app also uses server-side Supabase secrets, add them too.

## Docker deployment

Build and run the container:

```bash
docker build -t client-centric-files .
docker run -p 3000:3000 -e PORT=3000 -e VITE_SUPABASE_URL="https://..." -e VITE_SUPABASE_PUBLISHABLE_KEY="..." -e SUPABASE_URL="https://..." -e SUPABASE_PUBLISHABLE_KEY="..." client-centric-files
```

## Recommended hosting options

### Render

- Build command: `npm run build`
- Start command: `npm start`
- Environment: Node 20
- Add your Supabase env vars in Render's dashboard

### Railway

- Connect your GitHub repo
- Set build command: `npm run build`
- Set start command: `npm start`
- Add env vars in Railway project settings

### Any Docker-compatible host

Use the added `Dockerfile`.

## Notes

- The app is not purely static; it uses SSR and Supabase.
- `vercel.json` in the repo currently rewrites to `/index.html`, which is not correct for the SSR build.
- If you choose a platform that supports Node apps, use the `start` command above.
