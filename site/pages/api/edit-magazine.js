// site/pages/api/edit-magazine.js
import { base } from "@/lib/airtable";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, fields, email } = req.body;

  if (!email) {
    return res.status(401).json({ message: 'Unauthorized: Missing email' });
  }

  try {
    // Verify email logic here
    const isValidEmail = true; // Replace with actual logic

    if (!isValidEmail) {
      return res.status(401).json({ message: 'Unauthorized: Invalid email' });
    }

    // Update the record in Airtable
    const record = await base('YSWS Project Submission').update(id, fields);

    // Return the updated record
    res.status(200).json({
      id: record.id,
      "Code URL": record.fields["Code URL"] || null,
      "Playable URL": record.fields["Playable URL"] || null,
      "videoURL": record.fields["videoURL"] || null,
      "First Name": record.fields["First Name"] || null,
      "Last Name": record.fields["Last Name"] || null,
      "GitHub Username": record.fields["GitHub Username"] || null,
      "Description": record.fields["Description"] || null,
      "Screenshot": record.fields["Screenshot"] || null
    });
  } catch (error) {
    console.error('Error updating magazine submission:', error);
    res.status(500).json({ message: 'Error updating magazine submission', error: error.message });
  }
}