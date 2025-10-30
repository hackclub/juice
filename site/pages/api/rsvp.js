import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authToken = req.headers.authorization?.split(' ')[1];
    if (!authToken) {
      return res.status(401).json({ error: 'No auth token provided' });
    }

    // First find the email from Signups table using the token
    const signupRecords = await base('Signups').select({
      filterByFormula: `{token} = '${authToken}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userEmail = signupRecords[0].fields.email;

    // Create RSVP record in Airtable with the found email
    const record = await base('RSVP').create([
      {
        fields: {
          Email: userEmail,
          Meeting: 'Kickoff'
        }
      }
    ]);

    return res.status(200).json({ success: true, record: record[0] });
  } catch (error) {
    console.error('RSVP Error:', error);
    return res.status(500).json({ error: 'Failed to create RSVP' });
  }
} 