import Airtable from 'airtable';
import { withAuth } from './_middleware';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

export default withAuth(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Get all OMG moments for this user
    const records = await base('omgMoments').select({
      filterByFormula: `{email} = '${email}'`,
      sort: [{ field: 'created_at', direction: 'desc' }]
    }).all();

    const moments = records.map(record => ({
      id: record.id,
      timeHr: record.fields.timeHr || 0,
      status: record.fields.status || 'Pending',
      description: record.fields.description,
      video: record.fields.video,
      created_at: record.fields.created_at,
      reviewer_comments: record.fields.reviewer_comments
    }));

    return res.status(200).json(moments);
  } catch (error) {
    console.error('Error fetching moments:', error);
    return res.status(500).json({ message: 'Error fetching moments' });
  }
});
