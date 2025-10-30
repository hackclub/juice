import Airtable from 'airtable';
import { withAuth } from './_middleware';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

const KUDOS_LIMIT = 100;

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { momentId } = req.body;
  if (!momentId) {
    return res.status(400).json({ error: 'Missing momentId' });
  }

  try {
    // Get the current moment data
    const records = await base('omgMoments').select({
        filterByFormula: `RECORD_ID() = '${momentId}'`,
        maxRecords: 1
      }).firstPage();

    if (!records || records.length === 0) {
      throw new Error('Moment not found');
    }

    const record = records[0];
    const currentKudos = record.fields.kudos || 0;

    // Check if we've hit the kudos limit
    if (currentKudos >= KUDOS_LIMIT) {
      return res.status(200).json({
        kudos: currentKudos,
        message: 'Kudos limit reached',
        limitReached: true
      });
    }

    // Update the kudos count
    const updatedRecords = await base('omgMoments').update([
      {
        id: momentId,
        fields: {
          kudos: Math.min(KUDOS_LIMIT, currentKudos + 1)
        }
      }
    ]);

    if (!updatedRecords || updatedRecords.length === 0) {
      throw new Error('Failed to update kudos');
    }

    const newKudos = updatedRecords[0].fields.kudos;
    return res.status(200).json({
      kudos: newKudos,
      limitReached: newKudos >= KUDOS_LIMIT
    });
  } catch (error) {
    console.error('Error updating kudos:', error);
    return res.status(500).json({ error: 'Failed to update kudos' });
  }
});