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
    
    
    const stretchRecordsData = (await base("juiceStretches").select({
      filterByFormula: `
        AND(
          {email (from Signups)} = '${signupRecord.fields.email}',
          NOT({endtime}),
          NOT({isCanceled}),
          {pauseTimeStart}
        )
      `
    }).firstPage()).map((record) => record.fields);

    if(stretchRecordsData.length === 0) {
      res.status(200).json({});
      return;
    }

    const lastRecord = stretchRecordsData[0]
  
    console.log(lastRecord)
    const previousPauseTime = lastRecord.totalPauseTimeSeconds == undefined ? 0 : lastRecord.totalPauseTimeSeconds
    const newPauseTime = Math.round(previousPauseTime + Math.abs(new Date() - new Date(lastRecord.pauseTimeStart))/1000)
    res.status(200).json({ id: lastRecord.ID, startTime: lastRecord.startTime, totalPauseTimeSeconds: newPauseTime });

  } catch (error) {
    console.error('Error loading juice stretch:', error);
    res.status(500).json({ message: 'Error loading juice stretch' });
  }
} 