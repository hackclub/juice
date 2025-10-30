import { base } from '@/lib/airtable';
import { withAuth } from './_middleware';

export default withAuth(async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, fields } = req.body;

  try {
    const record = await base('YSWS Project Submission').find(id);
    const recordToken = record.fields.token ? record.fields.token[0] : null;

    const userToken =
      req.body.token || req.headers.authorization?.split(' ')[1];
    const providedToken = Array.isArray(userToken) ? userToken[0] : userToken;

    if (recordToken !== providedToken) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const updatedRecord = await base('YSWS Project Submission').update(id, fields);

    res.status(200).json({
      id: updatedRecord.id,
      "Code URL": updatedRecord.fields["Code URL"] || null,
      "Playable URL": updatedRecord.fields["Playable URL"] || null,
      "videoURL": updatedRecord.fields["videoURL"] || null,
      "First Name": updatedRecord.fields["First Name"] || null,
      "Last Name": updatedRecord.fields["Last Name"] || null,
      "GitHub Username": updatedRecord.fields["GitHub Username"] || null,
      "Description": updatedRecord.fields["Description"] || null,
      "Screenshot": updatedRecord.fields["Screenshot"] || null
    });
  } catch (error) {
    console.error('Error updating magazine submission:', error);
    res.status(500).json({ message: 'Error updating magazine submission', error: error.message });
  }
});