import Airtable from 'airtable';
import { v4 as uuidv4 } from 'uuid';
import { withAuth } from './_middleware';
import {escapeAirtableString, normalizeEmail, isValidEmail} from '../../lib/airtable-utils'


const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { stretchId } = req.body;
    const sanitisedStretchId = escapeAirtableString(stretchId);

    const records = await base('juiceStretches').select({
        filterByFormula: `{ID} = '${sanitisedStretchId}'`,
        maxRecords: 1
      }).firstPage();

    if (!records || records.length === 0) {
      return res.status(404).json({ message: 'Juice stretch not found' });
    }
    const previousPauseTime = records[0].fields.totalPauseTimeSeconds == undefined ? 0 : records[0].fields.totalPauseTimeSeconds
    const newPauseTime = Math.round(previousPauseTime + Math.abs(new Date() - new Date(records[0].fields.pauseTimeStart))/1000)
    await base('juiceStretches').update([
      {
        id: records[0].id,
        fields: {
          totalPauseTimeSeconds: newPauseTime,
          pauseTimeStart: new Date().toISOString()
        }
      }
    ]);

    res.status(200).json({ newPauseTime });
  } catch (error) {
    console.error('Error resuming juice stretch:', error);
    res.status(500).json({ message: 'Error resuming juice stretch' });
  }
});