import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check if the password is provided and correct
  const { password } = req.query;
  if (!password || password !== process.env.MAGAZINE_API_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or missing password' });
  }

  try {
    // Fetch records from the YSWS Project Submission table
    const records = await base('YSWS Project Submission')
      .select({
      })
      .all();

    // Return the complete record data with sensitive fields filtered out
    const submissions = records.map(record => {
      // Create a copy of the fields
      const fields = { ...record.fields };
      
      // Remove sensitive fields
      delete fields['Email'];
      delete fields['Address 1'];
      delete fields['Address 2'];
      delete fields['Zach (Temp) - Juice Invitee'];
      return {
        id: record.id,
        ...fields
      };
    });

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching magazine submissions:', error);
    res.status(500).json({ message: 'Error fetching magazine submissions', error: error.message });
  }
} 