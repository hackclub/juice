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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Normalize email to lowercase for consistent comparison
    const normalizedEmail = email.toLowerCase();

    // Check if email exists in Signups table
    const existingRecords = await base("Signups").select({
      filterByFormula: `LOWER({email}) = '${normalizedEmail}'`,
      maxRecords: 1
    }).firstPage();

    if (existingRecords.length > 0) {
      // Email exists, create a token resend record
      const tokenResendRecords = await base('tokenResends').select({
        filterByFormula: `AND(LOWER({email}) = '${normalizedEmail}', DATETIME_DIFF(NOW(), CREATED_TIME(), 'minutes') < 5)`,
        maxRecords: 1
      }).firstPage();

      if (tokenResendRecords.length === 0) {
        // Only create a new resend record if there hasn't been one in the last 5 minutes
        await base('tokenResends').create([
          {
            fields: {
              email: normalizedEmail // Just use email field
            }
          }
        ]);
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Token resend requested',
        isResend: true 
      });
    }

    // Create new signup record if email doesn't exist
    const record = await base("Signups").create([
      {
        fields: {
          email: normalizedEmail
        }
      }
    ]);

    return res.status(200).json({ 
      success: true, 
      record,
      isResend: false
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Send more specific error message back to client
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error processing registration',
      error: error.error || 'UNKNOWN_ERROR'
    });
  }
} 