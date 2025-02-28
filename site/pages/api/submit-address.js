import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, mailingAddress } = req.body;

    if (!token || !mailingAddress) {
      return res.status(400).json({ message: 'Token and mailing address are required' });
    }

    // Find user by token
    const records = await base(process.env.AIRTABLE_TABLE_NAME).select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const record = records[0];
    
    // Update the user record with mailing address only
    const updatedRecord = await base(process.env.AIRTABLE_TABLE_NAME).update([
      {
        id: record.id,
        fields: {
          Address: mailingAddress
        }
      }
    ]);

    return res.status(200).json({ 
      success: true, 
      record: updatedRecord[0]
    });

  } catch (error) {
    console.error('Address submission error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error processing address submission',
      error: error.error || 'UNKNOWN_ERROR'
    });
  }
} 