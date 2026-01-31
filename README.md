# Aurema Admin Dashboard

Admin dashboard for managing Aurema users, conversations, and meditations.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (component library)
- **Firebase Auth** (authentication)
- **React Query** (data fetching)

## Architecture

The admin dashboard communicates with `aurema-backend` for all data operations:

```
Admin Dashboard → aurema-backend API → Firestore
```

- Login uses Firebase Auth (same project as the mobile app)
- All data queries go through aurema-backend with Bearer token
- Backend verifies token AND checks `isStaff: true` on user document

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file (already created):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=https://aurema-backend.onrender.com/api
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Staff Access

Only users with `isStaff: true` in their Firestore user document can access the admin dashboard.

To grant staff access to a user:

1. Go to Firebase Console → Firestore
2. Find the user in the `users` collection
3. Add field: `isStaff: true`

### Features

- **Dashboard**: Overview statistics (users, subscriptions, conversations, meditations)
- **Users**: List all users, search by email/name, view user details
- **Conversations**: View all conversations, search by title/tags, see message threads
- **Meditations**: List all meditations with audio preview

## Backend Requirements

Make sure `aurema-backend` includes the admin endpoints:

- `GET /admin/stats`
- `GET /admin/users`
- `GET /admin/users/:userId`
- `GET /admin/users/:userId/conversations`
- `GET /admin/users/:userId/meditations`
- `GET /admin/conversations`
- `GET /admin/meditations`

All endpoints require:
1. `verifyToken` middleware (validates Firebase ID token)
2. `requireStaff` middleware (checks `isStaff: true`)

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works on any platform that supports Next.js (Netlify, Railway, etc.)

## Security

- Firebase credentials are public (client-side auth only)
- All sensitive data fetched through aurema-backend with token verification
- Backend enforces `isStaff` check on every admin endpoint
- CORS must be configured on aurema-backend to allow admin dashboard domain
