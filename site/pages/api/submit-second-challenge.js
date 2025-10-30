import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  return res.status(403).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, itchLink, platforms } = req.body;

    if (!token || !itchLink || !platforms?.length) {
      return res.status(400).json({ message: 'Token, itch.io link, and platforms are required' });
    }

    // First find user by token
    const userRecords = await base('Signups').select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (userRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRecord = userRecords[0];
    const userEmail = userRecord.fields.email;

    // Fetch user's OMG moments using email
    const omgMoments = await base('omgMoments').select({
      filterByFormula: `{email} = '${userEmail}'`,
      sort: [{ field: 'created_at', direction: 'desc' }]
    }).all();

    // Add debug logging
    console.log('User Email:', userEmail);
    console.log('Found OMG moments:', omgMoments.length);
    console.log('OMG moment IDs:', omgMoments.map(record => record.id));

    // Create new record in Ships table
    const shipRecord = await base('Ships').create([
      {
        fields: {
          Link: itchLink,
          Platforms: platforms,
          user: [userRecord.id],
          Type: 'base-mechanic',
          omgMomentsThatWentIntoThis: omgMoments.map(record => record.id)
        }
      }
    ]);

    // Add poc_submitted achievement
    await base('Signups').update([
      {
        id: userRecord.id,
        fields: {
          achievements: [...(userRecord.fields.achievements || []), 'poc_submitted']
        }
      }
    ]);

    return res.status(200).json({ 
      success: true,
      message: "Itch.io link submitted! Team will get back to you when they review it. Keep juicing",
      record: shipRecord[0]
    });

  } catch (error) {
    console.error('Ship submission error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error processing ship submission',
      error: error.error || 'UNKNOWN_ERROR'
    });
  }
} 