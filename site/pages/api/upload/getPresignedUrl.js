import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get file details from request
    const { fileName, fileType } = req.body;
    
    // Generate a unique file name to prevent overwriting
    const fileExtension = fileName.split('.').pop();
    const randomString = crypto.randomBytes(16).toString('hex');
    const uniqueFileName = `${randomString}-${Date.now()}.${fileExtension}`;
    
    // Set up parameters for S3 upload
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `card-images/${uniqueFileName}`,
      ContentType: fileType,
      // Optional: Set ACL to public-read if you want the file to be publicly accessible
      ACL: 'public-read',
    };

    // Create the command
    const command = new PutObjectCommand(params);
    
    // Generate a presigned URL for uploading
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // Generate the URL where the file will be accessible after upload
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    // Return both URLs to the client
    return res.status(200).json({ uploadUrl, fileUrl });
    
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return res.status(500).json({ error: 'Failed to generate upload URL' });
  }
} 