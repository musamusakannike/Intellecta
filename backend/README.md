# Kodr Backend - Email Verification

This backend now supports email verification via 6-digit codes and sends a themed welcome email when a user verifies successfully.

## Environment Variables
Add the following to your `.env` in `backend/`:

```
# App
JWT_SECRET=replace_me

# SMTP (example for Mailtrap, SendGrid, or your SMTP server)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_EMAIL=Kodr <no-reply@kodr.app>
```

## Endpoints

- POST `/auth/register`
  - body: `{ name, email, password, expoPushToken? }`
  - effect: Creates user as unverified and emails a 6-digit verification code. Returns `{ email }`.

- POST `/auth/verify-email`
  - body: `{ email, code }`
  - effect: Verifies account (within 15 minutes), sends welcome email, and returns `{ token, user }`.

- POST `/auth/resend-code`
  - body: `{ email }`
  - effect: Generates and emails a new 6-digit code valid for 15 minutes.

## Notes
- Verification code validity: 15 minutes.
- Register no longer returns a JWT. JWT is issued after successful email verification.
- Emails are dark purple space themed to match Kodr branding.
