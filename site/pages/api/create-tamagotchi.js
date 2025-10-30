import Airtable from 'airtable';
import { withAuth } from './_middleware';

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const existingTamagotchi = await base('Tamagotchi').select({
        filterByFormula: `{user} = '${req.user.email}'`,
        maxRecords: 1
      }).firstPage();

    if (existingTamagotchi && existingTamagotchi.length > 0) {
      return res.status(200).json({ message: 'Tamagotchi already exists' });
    }

    const startDate = new Date().toISOString();

    const record = await base('Tamagotchi').create([
      {
        fields: {
          user: [req.userId],
          startDate: startDate,
          isAlive: true,
          streakNumber: 0.0
        }
      }
    ]);

    res.status(200).json({ success: true, record: record[0] });
  } catch (error) {
    console.error('Error creating Tamagotchi:', error);
    res.status(500).json({ message: 'Error creating Tamagotchi' });
  }
});