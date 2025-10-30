import { S3 } from "aws-sdk";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { withAuth } from "../_middleware";

// Configure formidable to parse form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize S3 client
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Add this at the top of the file for debugging
console.log("S3 upload handler initialized with:", {
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_S3_BUCKET_NAME || "kodan-cdn",
});

export default withAuth(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Received upload request");

    // Parse the incoming form data using the updated formidable API
    const form = formidable({
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // In newer versions of formidable, files is an object with arrays
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Generate a unique file name
    const fileExtension = path.extname(
      file.originalFilename || file.originalName || ".jpg",
    );
    const randomString = crypto.randomBytes(16).toString("hex");
    const fileName = `card-images/${randomString}-${Date.now()}${fileExtension}`;

    // Read the file - filepath might be named differently in newer versions
    const filePath = file.filepath || file.path;
    const fileContent = fs.readFileSync(filePath);

    console.log(
      "File received:",
      file
        ? {
            name: file.originalFilename || file.originalName,
            size: fileContent.length,
            type: file.mimetype,
          }
        : "No file",
    );

    // Upload to S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "kodan-cdn",
      Key: fileName,
      Body: fileContent,
      ContentType: file.mimetype || "image/jpeg",
    };

    console.log("Uploading to S3 with params:", {
      Bucket: params.Bucket,
      Key: params.Key,
      ContentType: params.ContentType,
      Size: fileContent.length,
    });

    await s3.upload(params).promise();

    // Generate the URL where the file is accessible
    const imageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    console.log("Upload successful, returning URL:", imageUrl);

    // Return the URL to the client
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return res
      .status(500)
      .json({ error: "Failed to upload image", details: error.message });
  }
});
