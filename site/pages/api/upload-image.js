import AWS from 'aws-sdk';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = new formidable.IncomingForm();
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const file = files.file;
        const fileContent = fs.readFileSync(file.filepath);

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `card-images/${Date.now()}-${file.originalFilename}`,
            Body: fileContent,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        const uploadResult = await s3.upload(params).promise();

        // Clean up temp file
        fs.unlinkSync(file.filepath);

        res.status(200).json({ url: uploadResult.Location });
    } catch (error) {
        console.error('Error uploading to S3:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
} 