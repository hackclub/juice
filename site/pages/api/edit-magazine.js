// site/pages/api/edit-magazine.js
import { base } from "@/lib/airtable";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, fields, token } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    // Fetch the record to verify the token
    const record = await base('YSWS Project Submission').find(id);
    const recordToken = record.fields.token ? record.fields.token[0] : null; // Access the first element
    const providedToken = Array.isArray(token) ? token[0] : token; // Ensure token is not an array
    console.log('Record Token:', recordToken); // Debugging line
    console.log('Provided Token:', providedToken); // Debugging line

    if (recordToken !== providedToken) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Update the record in Airtable
    const updatedRecord = await base('YSWS Project Submission').update(id, fields);

    // Return the updated record
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
}