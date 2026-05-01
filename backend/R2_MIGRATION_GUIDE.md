# Cloudinary to Cloudflare R2 Migration Guide

This guide explains the migration from Cloudinary to Cloudflare R2 for cloud storage.

## What Changed

### Dependencies
- **Removed**: `cloudinary` package
- **Added**: 
  - `@aws-sdk/client-s3` - AWS SDK v3 for S3-compatible storage (R2 uses S3 API)
  - `sharp` - Image processing library for resizing and optimization

### Configuration Files
- **Removed**: `backend/config/cloudinary.config.js`
- **Added**: `backend/config/r2.config.js`

### Environment Variables
Replace Cloudinary variables with R2 variables in your `.env` file:

**Old (Cloudinary):**
```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**New (Cloudflare R2):**
```env
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-custom-domain.com
```

## Setting Up Cloudflare R2

### 1. Create an R2 Bucket
1. Log in to your Cloudflare dashboard
2. Navigate to **R2** in the sidebar
3. Click **Create bucket**
4. Enter a bucket name (e.g., `intellecta-storage`)
5. Click **Create bucket**

### 2. Generate API Tokens
1. In the R2 section, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Give it a name (e.g., `intellecta-backend`)
4. Set permissions to **Object Read & Write**
5. (Optional) Restrict to specific buckets
6. Click **Create API token**
7. **Save the Access Key ID and Secret Access Key** (you won't see them again!)

### 3. Set Up Public Access (Optional)
To serve images publicly:

#### Option A: Custom Domain (Recommended)
1. In your bucket settings, go to **Settings** > **Public access**
2. Click **Connect domain**
3. Enter your custom domain (e.g., `cdn.intellecta.com`)
4. Follow the DNS configuration instructions
5. Use this domain as your `R2_PUBLIC_URL`

#### Option B: R2.dev Subdomain (Free, but limited)
1. In your bucket settings, enable **Public access**
2. Click **Allow access** and enable the R2.dev subdomain
3. Your public URL will be: `https://<bucket-name>.<account-id>.r2.dev`
4. Use this as your `R2_PUBLIC_URL`

### 4. Configure Environment Variables
Update your `.env` file:

```env
# Get your account ID from the R2 dashboard URL
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com

# From the API token you created
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key

# Your bucket name
R2_BUCKET_NAME=intellecta-storage

# Your public URL (custom domain or R2.dev subdomain)
R2_PUBLIC_URL=https://cdn.intellecta.com
```

## Installation

Install the new dependencies:

```bash
cd backend
npm install
```

This will install:
- `@aws-sdk/client-s3@^3.709.0`
- `sharp@^0.33.5`

And remove:
- `cloudinary`

## Code Changes

### API Compatibility
The new R2 implementation maintains the same API interface as Cloudinary:

```javascript
// Upload (same interface)
const result = await uploadToR2(buffer, "profile-pictures");
// Returns: { secure_url, public_id, url }

// Delete (same interface)
await deleteFromR2(publicId);
```

### Files Modified
1. `backend/config/r2.config.js` - New R2 configuration
2. `backend/controllers/user.controller.js` - Updated imports and function calls
3. `backend/routes/user.route.js` - Updated multer import
4. `backend/package.json` - Updated dependencies
5. `backend/.env.example` - Updated environment variables

## Image Processing

The new implementation uses `sharp` for image processing:
- **Resize**: Images are resized to 400x400px
- **Format**: Converted to JPEG
- **Quality**: 85% quality for optimal size/quality balance
- **Fit**: Cover mode with center positioning

This replaces Cloudinary's transformation pipeline.

## Migration Checklist

- [ ] Create Cloudflare R2 bucket
- [ ] Generate R2 API tokens
- [ ] Set up public access (custom domain or R2.dev)
- [ ] Update `.env` file with R2 credentials
- [ ] Run `npm install` to update dependencies
- [ ] Test image upload functionality
- [ ] Test image deletion functionality
- [ ] (Optional) Migrate existing images from Cloudinary to R2

## Migrating Existing Images

If you have existing images in Cloudinary, you'll need to migrate them:

### Option 1: Lazy Migration
- Keep existing Cloudinary URLs in the database
- New uploads go to R2
- Gradually migrate as users update their profile pictures

### Option 2: Bulk Migration
Create a migration script to:
1. Download all images from Cloudinary
2. Upload them to R2
3. Update database records with new URLs

Example migration script structure:
```javascript
const User = require('./models/user.model');
const { uploadToR2 } = require('./config/r2.config');
const axios = require('axios');

async function migrateImages() {
  const users = await User.find({ 'profilePicture.url': { $exists: true } });
  
  for (const user of users) {
    try {
      // Download from Cloudinary
      const response = await axios.get(user.profilePicture.url, {
        responseType: 'arraybuffer'
      });
      
      // Upload to R2
      const result = await uploadToR2(Buffer.from(response.data), 'profile-pictures');
      
      // Update user record
      user.profilePicture = {
        url: result.secure_url,
        publicId: result.public_id
      };
      await user.save();
      
      console.log(`Migrated image for user ${user._id}`);
    } catch (error) {
      console.error(`Failed to migrate image for user ${user._id}:`, error);
    }
  }
}
```

## Benefits of R2 over Cloudinary

1. **Cost**: R2 has no egress fees (bandwidth is free)
2. **Pricing**: More predictable pricing model
3. **Performance**: Global CDN with low latency
4. **Control**: Full control over your storage
5. **S3 Compatible**: Standard S3 API, easy to migrate to/from

## Troubleshooting

### Images not loading
- Check that `R2_PUBLIC_URL` is correctly configured
- Verify bucket has public access enabled
- Ensure custom domain DNS is properly configured

### Upload failures
- Verify R2 API credentials are correct
- Check bucket permissions
- Ensure bucket name matches `R2_BUCKET_NAME`

### Sharp errors
- Make sure `sharp` is properly installed
- On some systems, you may need to rebuild: `npm rebuild sharp`

## Support

For issues with:
- **R2 Setup**: Check [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- **AWS SDK**: Check [AWS SDK for JavaScript v3 Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- **Sharp**: Check [Sharp Documentation](https://sharp.pixelplumbing.com/)
