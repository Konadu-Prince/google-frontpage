# Google OAuth Express Demo

This is a minimal Express app demonstrating Google OAuth 2.0 login using Passport.

## Setup

1. Copy env file and fill values:

```bash
cp .env.example .env
```

2. Create OAuth credentials in Google Cloud Console:
- Go to `https://console.cloud.google.com/`
- Create a project (or use an existing one)
- APIs & Services → Credentials → Create Credentials → OAuth client ID
- Application type: Web application
- Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
- Copy the Client ID and Client Secret to `.env`

3. Install dependencies (already installed if scaffolded by script):

```bash
npm install
```

4. Run the server:

```bash
npm start
```

Open `http://localhost:3000` and click "Sign in with Google".

## Notes
- The app stores the signed-in user in the session. Replace the in-memory user handling with your database in production.
- Set a strong `SESSION_SECRET` in `.env`.