# Quick Installation Guide for R2 Migration

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `@aws-sdk/client-s3@^3.709.0`
- `sharp@^0.33.5`

And remove:
- `cloudinary`

## Step 2: Configure Cloudflare R2

### Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** in the left sidebar
3. Click **Create bucket**
4. Enter bucket name (e.g., `intellecta-storage`)
5. Click **Create bucket**

### Generate API Tokens

1. In R2 section, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Name: `intellecta-backend`
4. Permissions: **Object Read & Write**
5. Click **Create API token**
6. **Copy and save** the Access Key ID and Secret Access Key

### Enable Public Access

#### Option A: Custom Domain (Recommended for Production)

1. In bucket settings, go to **Settings** → **Public access**
2. Click **Connect domain**
3. Enter your domain (e.g., `cdn.intellecta.com`)
4. Add the CNAME record to your DNS:
   ```
   Type: CNAME
   Name: cdn
   Target: <provided-by-cloudflare>
   ```
5. Wait for DNS propagation (can take a few minutes)

#### Option B: R2.dev Subdomain (Quick Setup for Development)

1. In bucket settings, click **Settings** → **Public access**
2. Click **Allow access**
3. Enable the R2.dev subdomain
4. Your URL will be: `https://<bucket-name>.<account-id>.r2.dev`

## Step 3: Update Environment Variables

Edit `backend/.env`:

```env
# Replace these with your actual values
R2_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<your-access-key-id>
R2_SECRET_ACCESS_KEY=<your-secret-access-key>
R2_BUCKET_NAME=intellecta-storage
R2_PUBLIC_URL=https://cdn.intellecta.com
```

### Finding Your Account ID

Your account ID is in the Cloudflare dashboard URL:
```
https://dash.cloudflare.com/<ACCOUNT_ID>/r2
```

Or check the R2 overview page.

### Example Configuration

```env
# Example (use your actual values)
R2_ENDPOINT=https://abc123def456.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=a1b2c3d4e5f6g7h8i9j0
R2_SECRET_ACCESS_KEY=k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
R2_BUCKET_NAME=intellecta-storage
R2_PUBLIC_URL=https://cdn.intellecta.com
```

## Step 4: Test the Setup

Start your server:

```bash
npm run dev
```

Test image upload:

```bash
# Using curl (replace with your auth token)
curl -X POST http://localhost:5000/api/users/profile-picture \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profilePicture=@/path/to/image.jpg"
```

Or use your frontend/mobile app to upload a profile picture.

## Step 5: Verify

Check that:
- ✅ Image uploads successfully
- ✅ Public URL is accessible
- ✅ Image is resized to 400x400px
- ✅ Image deletion works

## Troubleshooting

### "Access Denied" Error
- Verify API credentials are correct
- Check bucket permissions
- Ensure API token has "Object Read & Write" permission

### "Bucket Not Found" Error
- Verify `R2_BUCKET_NAME` matches your bucket name exactly
- Check that bucket exists in your account

### Images Not Loading
- Verify `R2_PUBLIC_URL` is correct
- Check that public access is enabled
- For custom domains, verify DNS is configured correctly
- Test the URL directly in a browser

### Sharp Installation Issues
On some systems, you may need to rebuild sharp:
```bash
npm rebuild sharp
```

Or install build tools:
```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt-get install build-essential

# Windows
npm install --global windows-build-tools
```

## Migration from Cloudinary

If you have existing images in Cloudinary, see `R2_MIGRATION_GUIDE.md` for migration strategies.

## Cost Comparison

### Cloudinary Free Tier
- 25 GB storage
- 25 GB bandwidth/month
- Limited transformations

### Cloudflare R2
- $0.015/GB storage per month
- **$0 egress fees** (bandwidth is FREE!)
- No transformation limits

**Example**: 100GB storage + 1TB bandwidth/month
- Cloudinary: ~$99/month
- R2: ~$1.50/month (storage only, bandwidth is free!)

## Next Steps

1. ✅ Install dependencies
2. ✅ Create R2 bucket
3. ✅ Generate API tokens
4. ✅ Configure environment variables
5. ✅ Test upload/delete functionality
6. 📋 (Optional) Migrate existing images
7. 🚀 Deploy to production

## Support

- **Cloudflare R2**: https://developers.cloudflare.com/r2/
- **AWS SDK v3**: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
- **Sharp**: https://sharp.pixelplumbing.com/

For project-specific help, see:
- `R2_MIGRATION_GUIDE.md` - Detailed migration guide
- `config/R2_SETUP.md` - Configuration reference
- `CLOUDINARY_TO_R2_CHANGES.md` - Summary of changes
