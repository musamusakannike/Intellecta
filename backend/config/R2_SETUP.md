# Cloudflare R2 Configuration

This file explains the R2 configuration used in this project.

## Quick Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Set environment variables** in `.env`:
   ```env
   R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_BUCKET_NAME=your_bucket_name
   R2_PUBLIC_URL=https://your-custom-domain.com
   ```

3. **Create R2 bucket** in Cloudflare dashboard

4. **Enable public access** for the bucket (or set up custom domain)

## Configuration Details

### r2.config.js

This module exports:

- **`r2Client`**: Configured S3Client for R2
- **`upload`**: Multer middleware for handling file uploads
- **`uploadToR2(buffer, folder)`**: Upload image to R2 with processing
- **`deleteFromR2(key)`**: Delete image from R2

### Image Processing

Images are automatically processed on upload:
- Resized to 400x400px (cover fit)
- Converted to JPEG format
- Compressed to 85% quality
- Unique filename generated

### File Structure

Uploaded files are stored with this structure:
```
bucket/
  └── profile-pictures/
      ├── 1234567890-abc123def456.jpg
      ├── 1234567891-def789ghi012.jpg
      └── ...
```

## Usage Example

```javascript
const { uploadToR2, deleteFromR2 } = require('../config/r2.config');

// Upload
const result = await uploadToR2(fileBuffer, 'profile-pictures');
console.log(result.secure_url); // Public URL
console.log(result.public_id);  // R2 key for deletion

// Delete
await deleteFromR2(result.public_id);
```

## Environment Variables Explained

- **`R2_ENDPOINT`**: Your R2 endpoint URL (includes account ID)
- **`R2_ACCESS_KEY_ID`**: API token access key
- **`R2_SECRET_ACCESS_KEY`**: API token secret key
- **`R2_BUCKET_NAME`**: Name of your R2 bucket
- **`R2_PUBLIC_URL`**: Public URL for accessing files (custom domain or R2.dev)

## Finding Your Account ID

Your account ID is in the Cloudflare dashboard URL:
```
https://dash.cloudflare.com/<account_id>/r2
```

Or in the R2 overview page.

## Security Notes

- Never commit `.env` file to version control
- Rotate API tokens periodically
- Use least-privilege permissions (Object Read & Write only)
- Consider restricting API tokens to specific buckets
- Enable CORS if accessing from browser

## CORS Configuration (if needed)

If you need to access R2 directly from the browser, configure CORS in your bucket settings:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

For this backend implementation, CORS is not required since uploads go through the server.
