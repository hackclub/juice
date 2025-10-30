import Airtable from 'airtable';
import { withAuth } from './_middleware';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { description, stretchId, stopTime } = req.body;

    const omgMoment = await base('omgMoments').create([
      {
        fields: {
          description,
          email: req.user.email
        }
      }
    ]);

    await base('juiceStretches').update([
      {
        id: stretchId,
        fields: {
          endTime: stopTime,
          omgMoment: [omgMoment[0].id]
        }
      }
    ]);

    res.status(200).json({ message: 'OMG moment created and juice stretch ended' });
  } catch (error) {
    console.error('Error creating OMG moment:', error);
    res.status(500).json({ message: 'Error creating OMG moment' });
  }
});