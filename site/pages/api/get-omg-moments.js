import base from "@/lib/airtable";

/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the user's start time and convert to UTC
    const userStartTime = req.query.startTime ? 
      new Date(new Date(req.query.startTime).toISOString()) : 
      new Date(new Date().toISOString());
    
    // Calculate timestamp for 24 hours from start time in UTC
    const twentyFourHoursFromStart = new Date(userStartTime.getTime() + 24 * 60 * 60 * 1000);
    
    // Fetch records within the 24-hour window using UTC timestamps
    const records = await base('omgMoments')
      .select({
        filterByFormula: `AND(
          IS_AFTER({created_at}, '${userStartTime.toISOString()}'),
          IS_BEFORE({created_at}, '${twentyFourHoursFromStart.toISOString()}')
        )`,
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
