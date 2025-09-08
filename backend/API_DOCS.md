# Kodr API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Auth Endpoints

### POST /auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "expoPushToken": "ExponentPushToken[xxx]" // optional
}
```

### POST /auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### POST /auth/verify-email
Verify email with 6-digit code
```json
{
  "email": "john@example.com",
  "code": "123456"
}
```

### POST /auth/resend-code
Resend verification code
```json
{
  "email": "john@example.com"
}
```

## User Profile Endpoints

### GET /users/profile
Get current user profile (requires auth)

### PUT /users/profile
Update user profile (requires auth)
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

### PUT /users/change-password
Change password (requires auth)
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

### POST /users/profile-picture
Upload profile picture (requires auth)
- Form-data with file field: `profilePicture`
- Supports: JPG, PNG, GIF
- Max size: 5MB

### DELETE /users/profile-picture
Delete profile picture (requires auth)

### PUT /users/expo-token
Update Expo push token (requires auth)
```json
{
  "expoPushToken": "ExponentPushToken[xxx]"
}
```

### DELETE /users/account
Delete user account (requires auth)

## Admin Endpoints (Admin role required)

### GET /users/admin/dashboard
Get dashboard statistics

### GET /users/admin/users
Get all users with pagination and filtering
- Query params: `page`, `limit`, `role`, `verified`, `isPremium`

### GET /users/admin/users/:id
Get user by ID

### PUT /users/admin/users/:id
Update user (admin only)
```json
{
  "role": "admin",
  "verified": true,
  "isPremium": true,
  "premiumExpiryDate": "2024-12-31T00:00:00.000Z"
}
```

### DELETE /users/admin/users/:id
Delete user (admin only)

## Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // validation errors if any
}
```

## Success Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": {} // response data
}
```

## Environment Variables Required

### MongoDB
- `MONGO_URI`: MongoDB connection string

### JWT
- `JWT_SECRET`: Secret key for JWT tokens

### SMTP (for emails)
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_SECURE`: true/false
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `FROM_EMAIL`: Sender email address

### Cloudinary (for image uploads)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## Rate Limiting
- 100 requests per 15 minutes window
- Applied globally to all endpoints
