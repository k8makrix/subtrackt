# Security: Secret Rotation

## BETTER_AUTH_SECRET

The session secret must be a strong, random value. To rotate:

1. Generate a new secret:
   ```bash
   openssl rand -base64 32
   ```

2. Update `.env.local` locally:
   ```
   BETTER_AUTH_SECRET="<paste-new-secret>"
   ```

3. Update in Vercel:
   - Go to Project Settings > Environment Variables
   - Update `BETTER_AUTH_SECRET` with the new value
   - Redeploy

**Note:** Rotating the secret invalidates all existing sessions. Users will need to sign in again.

## Google OAuth Credentials

If the client secret has been exposed:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select the OAuth 2.0 Client ID for subtrackt
3. Click "Reset Secret" to generate a new client secret
4. Update `GOOGLE_CLIENT_SECRET` in `.env.local` and Vercel env vars

## Redirect URI (Required for Production)

Add this redirect URI in Google Cloud Console for the OAuth client:

```
https://subtrackt.vercel.app/api/auth/callback/google
```
