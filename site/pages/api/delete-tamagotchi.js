import Airtable from 'airtable';

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    
    // Get user's email from Signups table
    const signupRecords = await base('Signups').select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const signupRecord = signupRecords[0];

    // Find user's Tamagotchi
    const tamagotchiRecords = await base('Tamagotchi').select({
      filterByFormula: `{user} = '${signupRecord.fields.email}'`,
      maxRecords: 1
    }).firstPage();

    if (!tamagotchiRecords || tamagotchiRecords.length === 0) {
      return res.status(404).json({ message: 'Tamagotchi not found' });
    }

    // Delete the Tamagotchi record
    await base('Tamagotchi').destroy([tamagotchiRecords[0].id]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting Tamagotchi:', error);
    res.status(500).json({ message: 'Error deleting Tamagotchi' });
  }
} 