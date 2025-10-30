import Airtable from 'airtable';
import { v4 as uuidv4 } from 'uuid';

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
    const stretchId = uuidv4();

    // Create new record in juiceStretches with a reference to the Signups record
    await base('juiceStretches').create([
      {
        fields: {
          ID: stretchId,
          Signups: [signupRecord.id], // Link to the Signups record
          startTime: new Date().toISOString()
        }
      }
    ]);

    res.status(200).json({ stretchId });
  } catch (error) {
    console.error('Error starting juice stretch:', error);
    res.status(500).json({ message: 'Error starting juice stretch' });
  }
} 