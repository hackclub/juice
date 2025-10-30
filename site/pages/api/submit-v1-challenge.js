import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, gameWebsiteUrl, githubLink } = req.body;

    if (!token || !gameWebsiteUrl || !githubLink) {
      return res.status(400).json({ 
        success: false,
        message: 'Token, game website URL, and GitHub link are required' 
      });
    }

    // First find user by token
    const userRecords = await base('Signups').select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (userRecords.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const userRecord = userRecords[0];
    const userEmail = userRecord.fields.email;

    // Fetch user's OMG moments using email
    const omgMoments = await base('omgMoments').select({
      filterByFormula: `{email} = '${userEmail}'`,
      sort: [{ field: 'created_at', direction: 'desc' }]
    }).all();

    // Create new record in Ships table
    const shipRecord = await base('Ships').create([
      {
        fields: {
          Link: gameWebsiteUrl,
          user: [userRecord.id],
          Type: 'v1',
          omgMomentsThatWentIntoThis: omgMoments.map(record => record.id)
        }
      }
    ]);

    // Add v1_submitted achievement and update GitHubLink in Signups table
    await base('Signups').update([
      {
        id: userRecord.id,
        fields: {
          achievements: [...(userRecord.fields.achievements || []), 'v1_submitted'],
          GitHubLink: githubLink
        }
      }
    ]);

    return res.status(200).json({ 
      success: true,
      message: "V1 of your game has been submitted! look forward to trying your game ~Thomas",
      record: shipRecord[0]
    });

  } catch (error) {
    console.error('V1 submission error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error processing V1 submission',
      error: error.error || 'UNKNOWN_ERROR'
    });
  }
} 