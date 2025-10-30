import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            gameTitle,
            characterName,
            HP,
            moveName,
            moveDescription,
            specialMoveName,
            specialMoveDescription,
            itchLink,
            shader,
            image  // This is now the S3 URL
        } = req.body;

        // Get user from auth token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization token' });
        }

        const token = authHeader.split(' ')[1];
        
        // Get user record
        const userRecords = await base("Signups").select({
            filterByFormula: `{token} = '${token}'`,
            maxRecords: 1
        }).firstPage();

        if (userRecords.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRecords[0].id;

        // Create card record with S3 image URL
        const record = await base('deck').create({
            creator: [userId],
            gameTitle,
            characterName,
            HP,
            moveName,
            moveDescription,
            specialMoveName,
            specialMoveDescription,
            itchLink,
            shader,
            image: image // Store the S3 URL
        });

        return res.status(200).json({ 
            message: 'Card added successfully',
            record: record.fields 
        });

    } catch (error) {
        console.error('Error adding card to deck:', error);
        return res.status(500).json({ error: 'Failed to add card to deck' });
    }
} 