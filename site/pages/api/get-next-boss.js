import Airtable from 'airtable';
import { ReplaceStencilOp } from 'three';
import { v4 as uuidv4 } from 'uuid';

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  return res.status(403).end();

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

    const records = await base('jungleBosses').select({}).firstPage();

    // const jungleBossesFought = signupRecord.fields.jungleBossesFought || [];
    // console.log(jungleBossesFought)
    // Fetch jungle bosses fought by Airtable record ID
    const jungleBossesFoughtRecords = await base("jungleBossesFought").select({
      filterByFormula: `{user} = '${signupRecord.fields.email}'`
    }).firstPage();

    const jungleBossesFoughtIds = jungleBossesFoughtRecords.map(jungleBossFought => jungleBossFought.fields.jungleBoss[0])
    console.log(jungleBossesFoughtIds)

    // Filter jungle bosses not fought and sort by hours
    const jungleBossesNotFought = records
      .filter(record => !jungleBossesFoughtIds.includes(record.id) && record.fields.hours)
      .sort((a, b) => a.fields.hours - b.fields.hours);

    // console.log(jungleBossesNotFought);
    if (!jungleBossesNotFought || jungleBossesNotFought.length === 0) {
      return res.status(200).json({ message: 'No jungle bosses left to fight' });
    }

    // Calculate time to fight the next boss not fought
    res.status(200).json({ 
      timeToNextBoss: jungleBossesNotFought[0].fields.hours - signupRecord.fields.totalJungleHours, boss: jungleBossesNotFought[0].fields
    });
  } catch (error) {
    console.error('Error resuming jungle stretch:', error);
    res.status(500).json({ message: 'Error resuming jungle stretch' });
  }
} 