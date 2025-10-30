import Airtable from 'airtable';
import { withAuth } from './_middleware';

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const tamagotchiRecords = await base('Tamagotchi').select({
        filterByFormula: `{user} = '${req.user.email}'`,
        maxRecords: 1
      }).firstPage();

    if (!tamagotchiRecords || tamagotchiRecords.length === 0) {
      return res.status(404).json({ message: 'Tamagotchi not found' });
    }

    await base('Tamagotchi').destroy([tamagotchiRecords[0].id]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting Tamagotchi:', error);
    res.status(500).json({ message: 'Error deleting Tamagotchi' });
  }
});