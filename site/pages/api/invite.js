import base from '@/lib/airtable';

/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authToken = req.headers.authorization?.split(' ')[1];
  if (!authToken) {
    return res.status(401).json({ message: 'No auth token provided' });
  }

  try {
    const { invitedParticipantEmail, flavor } = req.body;

    if (!invitedParticipantEmail || !flavor) {
      return res.status(400).json({ message: 'Email and flavor are required' });
    }

    // First, get the sender's record from their auth token
    const userRecords = await base('signups').select({
      filterByFormula: `{token} = '${authToken}'`,
      maxRecords: 1
    }).firstPage();

    if (userRecords.length === 0) {
      return res.status(404).json({ message: `Sender not found, ${authToken}` });
    }

    const userRecord = userRecords[0];
    const senderEmail = userRecord.fields.email || "";
    const invitesAvailable = userRecord.fields.invitesAvailable || [];

    // Check if user has the specified flavor invite available
    if (!invitesAvailable.includes(flavor)) {
      return res.status(400).json({ message: 'Invite flavor not available' });
    }

    // Remove the used invite from available invites
    const updatedInvites = invitesAvailable.filter(invite => invite !== flavor);

    // Update the user's record with remaining invites
    await base('signups').update([
      {
        id: userRecord.id,
        fields: {
          invitesAvailable: updatedInvites
        }
      }
    ]);

    // Create the invite record
    const record = await base('Invites').create([
      {
        fields: {
          invitedParticipantEmail,
          sentFrom: senderEmail,
          flavor
        }
      }
    ]);

    return res.status(200).json({ 
      success: true, 
      record,
      remainingInvites: updatedInvites 
    });
  } catch (error) {
    console.error('Invite creation error:', error);
    return res.status(500).json({ 
      message: error.message || 'Error creating invite',
      error: error.error || 'UNKNOWN_ERROR'
    });
  }
} 