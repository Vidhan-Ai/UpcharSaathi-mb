# Environment Variables

This application requires the following environment variables to be set in your Vercel project settings or `.env` file.

## Core Configuration
- `NEXT_PUBLIC_APP_URL`: The URL of your deployed application (e.g., `https://upcharsaathi.vercel.app`).
- `NODE_ENV`: Set to `production` on Vercel.

## Database (Prisma)
- `DATABASE_URL`: The connection string for your PostgreSQL database.
  - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`
  - **Important**: Ensure your database supports the `pgcrypto` extension if you are using UUID generation functions.

## Authentication (Stack Auth)
- `NEXT_PUBLIC_STACK_PROJECT_ID`: Your Stack Auth Project ID.
- `STACK_SECRET_SERVER_KEY`: Your Stack Auth Server Key.
- `STACK_PUBLISHABLE_CLIENT_KEY`: Your Stack Auth Client Key (if applicable/used).

## Optional / Legacy (Cleaned Up)
The following variables were used in previous versions but have been removed or are no longer critical for the core flow, but check if you have any custom integrations relying on them:
- `JWT_SECRET`: (Removed) Replaced by Stack Auth.
- `JWT_REFRESH_SECRET`: (Removed) Replaced by Stack Auth.
- `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: (Removed) Email verification is now handled by Stack Auth.
- `REDIS_URL`: (Removed) Session management is now handled by Stack Auth.

## Vercel Deployment Instructions
1. Go to your Vercel Project Dashboard.
2. Navigate to **Settings** > **Environment Variables**.
3. Add the variables listed above.
4. Redeploy your application for changes to take effect.
