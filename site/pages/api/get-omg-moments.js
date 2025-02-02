import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Calculate timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Fetch records from the past 24 hours
    const records = await base('omgMoments')
      .select({
        filterByFormula: `IS_AFTER({created_at}, '${twentyFourHoursAgo}')`,
        sort: [{ field: 'created_at', direction: 'desc' }]
      })
      .all();

    const moments = records.map(record => ({
      id: record.id,
      description: record.fields.description,
      video: record.fields.video,
      created_at: record.fields.created_at,
      // email: record.fields.email,
      slackId: record.fields["Slack ID"],
      kudos: record.fields.kudos || 0
    }));

    res.status(200).json(moments);
  } catch (error) {
    console.error('Error fetching OMG moments:', error);
    res.status(500).json({ message: 'Error fetching OMG moments' });
  }
} 
