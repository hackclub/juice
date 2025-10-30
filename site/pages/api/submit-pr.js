import Airtable from 'airtable';
import { withAuth } from './_middleware';
import {escapeAirtableString, normalizeEmail, isValidEmail} from '../../lib/airtable-utils'


const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, prLink } = req.body;
    const sanitisedToken = escapeAirtableString(token);
    const sanitisedPrLink = escapeAirtableString(prLink);

    if (!token || !prLink) {
      return res.status(400).json({ message: 'Token and PR link are required' });
    }

    // Find user by token
    const records = await base("Signups").select({
      filterByFormula: `{token} = '${sanitisedToken}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const record = records[0];
    
    // Update the user record with PR link and achievement
    const updatedRecord = await base("Signups").update([
      {
        id: record.id,
        fields: {
          game_pr: sanitisedPrLink,
          achievements: [...(record?.fields?.achievements || []), 'pr_submitted']
        }
      }
    ]);

    return res.status(200).json({ 
      success: true, 
      record: updatedRecord[0]
    });

  } catch (error) {
    console.error('PR submission error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error processing PR submission',
      error: error.error || 'UNKNOWN_ERROR'
    });
  }
});