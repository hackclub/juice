import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email parameter is required' });
  }

  try {
    const records = await base('RawRoommateData')
      .select({
        filterByFormula: `{Email Address} = '${email}'`,
      })
      .all();

    const roommateData = records.map(record => ({
      ...record.fields
    }));

    res.status(200).json(roommateData);
  } catch (error) {
    console.error('Error fetching roommate data:', error);
    res.status(500).json({ message: 'Error fetching roommate data' });
  }
} 