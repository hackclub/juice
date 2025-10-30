import Airtable from 'airtable';
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

    // Find the record with matching ID
    const records = await base('jungleStretches').select({
        filterByFormula: `{ID} = '${sanitisedStretchId}'`,
        maxRecords: 1
      }).firstPage();

    if (!records || records.length === 0) {
      return res.status(404).json({ message: 'jungle stretch not found' });
    }

    // Update the record with end time
    await base('jungleStretches').update([
      {
        id: records[0].id,
        fields: {
          endTime: new Date().toISOString()
        }
      }
    ]);

    res.status(200).json({ message: 'jungle stretch ended' });
  } catch (error) {
    console.error('Error stopping jungle stretch:', error);
    res.status(500).json({ message: 'Error stopping jungle stretch' });
  }
});