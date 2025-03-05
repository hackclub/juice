import formidable from 'formidable';
import fs from 'fs';
import { uploadToS3 } from '../utils/s3.js';
import { getUserByToken, createOmgMoment, updateJuiceStretch, updateJungleStretch } from '../utils/airtable.js';

export async function uploadVideo(req, res) {
  try {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Extract first value from array fields
    const token = Array.isArray(fields.token) ? fields.token[0] : fields.token;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const stretchId = Array.isArray(fields.stretchId) ? fields.stretchId[0] : fields.stretchId;
    const stopTime = new Date().toISOString();
    const isJuice = Array.isArray(fields.isJuice) ? fields.isJuice[0] : fields.isJuice;
    
    if (!files.video) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;

    // Get user by token
    const signupRecord = await getUserByToken(token);

    // Upload video to S3
    const videoBuffer = fs.readFileSync(videoFile.filepath);
    const s3Key = `omg-moments/${Date.now()}-${videoFile.originalFilename}`;
    const s3Upload = await uploadToS3(videoBuffer, s3Key, videoFile.mimetype);

    // Create OMG moment record with video URL
    const omgMoment = await createOmgMoment(
      description,
      signupRecord.fields.email,
      s3Upload.Location
    );

    console.log(isJuice)
    
    if (isJuice == "true"){
      // Update juice stretch with end time and link to OMG moment
      await updateJuiceStretch(stretchId, stopTime, omgMoment.id);
    } else {
      // Update jungle stretch with end time and link to OMG moment
      await updateJungleStretch(stretchId, stopTime, omgMoment.id)
    }

    // Clean up the temporary file
    fs.unlinkSync(videoFile.filepath);

    res.status(200).json({ message: 'OMG moment created and juice stretch ended' });
  } catch (error) {
    console.error('Error creating OMG moment:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Error creating OMG moment' });
  }
} 
