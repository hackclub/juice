import AWS from "aws-sdk";
import formidable from "formidable";
import fs from "fs";
import { withAuth } from "./_middleware";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default withAuth(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    if (!files.file || !files.file[0]) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = files.file[0];
    const fileContent = fs.readFileSync(file.filepath);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `screenshots/${Date.now()}-${file.originalFilename}`,
      Body: fileContent,
      ContentType: file.mimetype,
    };

    const uploadResult = await s3.upload(params).promise();

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({ url: uploadResult.Location });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
});
