import Airtable from 'airtable';
import { withAuth } from './_middleware';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const record = await base('RSVP').create([
      {
        fields: {
          Email: req.user.email,
          Meeting: 'Kickoff'
        }
      }
    ]);

    return res.status(200).json({ success: true, record: record[0] });
  } catch (error) {
    console.error('RSVP Error:', error);
    return res.status(500).json({ error: 'Failed to create RSVP' });
  }
});