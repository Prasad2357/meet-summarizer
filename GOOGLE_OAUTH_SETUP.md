# Google OAuth Setup Guide

## Overview
This guide will help you set up Google OAuth for the Meet Summarizer application.

## Prerequisites
- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and select "New Project"
3. Enter a project name (e.g., "Meet Summarizer")
4. Click "Create"

## Step 2: Enable Google Sign-In API

1. In your Google Cloud project, go to **APIs & Services** > **Library**
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google+ API" and enable it

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** and select **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: Meet Summarizer
     - User support email: your email
     - Developer contact information: your email
   - Click "Save and Continue"
   - Skip the "Scopes" step for now
   - Add test users if needed
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Meet Summarizer Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - `http://localhost:3000` (backup)
     - Add your production URL when deploying
   - Authorized redirect URIs:
     - `http://localhost:5173` (for local development)
     - Add your production URL when deploying
   - Click **"CREATE"**

5. Copy the **Client ID** and **Client secret**

## Step 4: Configure Your Application

### Backend Configuration

1. Open `d:\Projects\Meet_Summarizer\.env`
2. Update the Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

### Frontend Configuration

1. Open `d:\Projects\Meet_Summarizer\frontend\.env`
2. Update the Google Client ID:

```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
```

**Note:** The Client ID should be the same for both backend and frontend.

## Step 5: Run Database Migration

Before running the application, you need to apply the database migration to add the `google_id` column:

```bash
# Navigate to project root
cd d:\Projects\Meet_Summarizer

# Apply migrations
# Note: If you have alembic installed in your environment
python -m alembic upgrade head

# OR if the above doesn't work, you can manually add the column
# Connect to your database and run:
# ALTER TABLE users ADD COLUMN google_id VARCHAR UNIQUE;
# ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
```

## Step 6: Test the Integration

1. Start the backend server:
```bash
cd d:\Projects\Meet_Summarizer
uvicorn app.main:app --reload --port 8000
```

2. Start the frontend dev server:
```bash
cd d:\Projects\Meet_Summarizer\frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`
4. Click on "Continue with Google"
5. Sign in with your Google account
6. You should be redirected to the dashboard upon successful authentication

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Make sure the redirect URI in Google Cloud Console exactly matches your app's URL
   - Include `http://localhost:5173` in Authorized JavaScript origins

2. **"Google Sign-In not loaded" error**
   - Check your internet connection
   - Ensure the Google Client ID is correctly set in `.env`
   - Refresh the page

3. **Database errors**
   - Make sure you've run the migration to add the `google_id` column
   - Check that `password_hash` is nullable in the database

4. **Token verification failed**
   - Ensure your Google Client ID matches in both frontend and backend
   - Check that the client secret is correct in the backend `.env`

## API Endpoints

The OAuth implementation adds the following endpoint:

- **POST** `/auth/oauth/google`
  - Request body: `{ "token": "google_oauth_token" }`
  - Response: `{ "access_token": "jwt_token", "token_type": "bearer" }`

## Security Notes

1. **Never commit `.env` files** to version control
2. Keep your Client Secret secure and don't share it
3. In production, use HTTPS for all OAuth redirects
4. Regularly rotate your OAuth credentials
5. Limit the OAuth consent screen to only necessary scopes

## Production Deployment

When deploying to production:

1. Update the Authorized JavaScript origins in Google Cloud Console with your production URL
2. Update the Authorized redirect URIs with your production URL
3. Update the `VITE_GOOGLE_CLIENT_ID` in your production environment
4. Ensure your backend `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in production
5. Use HTTPS for all production URLs

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In for Web](https://developers.google.com/identity/gsi/web)
- [FastAPI OAuth Documentation](https://fastapi.tiangolo.com/tutorial/security/oauth2/)
