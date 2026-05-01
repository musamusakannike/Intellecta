const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const sharp = require("sharp");
const crypto = require("crypto");

// Configure Cloudflare R2 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Upload image to Cloudflare R2
const uploadToR2 = async (buffer, folder = "profile-pictures") => {
  try {
    // Process image with sharp (resize and optimize)
    const processedBuffer = await sharp(buffer)
      .resize(400, 400, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const fileId = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    const key = `${folder}/${timestamp}-${fileId}.jpg`;

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: processedBuffer,
      ContentType: "image/jpeg",
    });

    await r2Client.send(command);

    // Construct public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return {
      secure_url: publicUrl,
      public_id: key, // Using the key as the public_id for consistency
      url: publicUrl,
    };
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw new Error(`Failed to upload image to R2: ${error.message}`);
  }
};

// Delete image from Cloudflare R2
const deleteFromR2 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
    return { result: "ok" };
  } catch (error) {
    console.error("Error deleting from R2:", error);
    throw new Error(`Failed to delete image from R2: ${error.message}`);
  }
};

module.exports = {
  r2Client,
  upload,
  uploadToR2,
  deleteFromR2,
};
