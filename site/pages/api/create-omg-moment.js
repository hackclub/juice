import Airtable from 'airtable';

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { description, token, stretchId, stopTime } = req.body;

    // Get user by token
    const signupRecords = await base('Signups').select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const signupRecord = signupRecords[0];

    // Create OMG moment record with video URL
    const omgMoment = await base('omgMoments').create([
      {
        fields: {
          description,
          email: signupRecord.fields.email
        }
      }
    ]);

    // Update juice stretch with end time and link to OMG moment
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
} 