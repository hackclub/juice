import Airtable from 'airtable';
import { withAuth } from './_middleware';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default withAuth(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email parameter is required' });
  }
  const rawEmail = Array.isArray(email) ? email[0] : email;
  const normalizedEmail = String(rawEmail || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Invalid email parameter' });
  }
  const escapeAirtableString = str =>
    String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'");

  const escaped = escapeAirtableString(normalizedEmail);

  try {
    const records = await base('RawRoommateData')
      .select({
        filterByFormula: `LOWER({Email Address}) = '${escaped}'`,
      })
      .all();

    const allowedKeys = [
      'Submission ID',
      'Last updated',
      'Submission started',
      'Status',
      'Current step',
      'Full Name',
      'Email Address',
      'Age',
      'Gender',
      "Country you're from",
      'Short catch phrase that embodies your vibe (for others to see)',
      'Your Phone Number',
      "WeChat Contact (put - if you do not have one yet or INDIA if you're in India)",
      'Slack Handle',
      'Favorite Game',
      'Favorite Food',
      'Favorite Flavor of Juice',
      'Mandarin speaking ability',
      "Name of the game you're making",
      'Link to your game'
    ];

    const roommateData = records.map(record => {
      const fields = record.fields || {};
      const out = {};
      for (const k of allowedKeys) {
        if (Object.prototype.hasOwnProperty.call(fields, k)) {
          out[k] = fields[k];
        }
      }
      return out;
    });

    res.status(200).json(roommateData);
  } catch (error) {
    console.error('Error fetching roommate data:', error);
    res.status(500).json({ message: 'Error fetching roommate data' });
  }
});