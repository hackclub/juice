import base from '@/lib/airtable';

/** @type {import('next').NextApiHandler} */
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
    
    
    const jungleStretches = (await base('jungleStretches').select({
        filterByFormula: `
            AND(
            {email (from Signups)} = '${signupRecord.fields.email}',
            ({endtime}),
            NOT({isCanceled})
            )
        `,
      }).firstPage()).map((record) => record.fields);

    if(jungleStretches.length === 0) {
      res.status(200).json({});
      return;
    }

    let kiwisCollected = 0;
    let lemonsCollected = 0;
    let orangesCollected = 0;
    let applesCollected = 0;
    let blueberriesCollected = 0;

    jungleStretches.forEach((jungleRecord) => {
        kiwisCollected += jungleRecord.kiwisCollected == undefined ? 0 : jungleRecord.kiwisCollected;
        lemonsCollected += jungleRecord.lemonsCollected == undefined ? 0 : jungleRecord.lemonsCollected;
        orangesCollected += jungleRecord.orangesCollected == undefined ? 0 : jungleRecord.orangesCollected;
        applesCollected += jungleRecord.applesCollected == undefined ? 0 : jungleRecord.applesCollected;
        blueberriesCollected += jungleRecord.blueberriesCollected == undefined ? 0 : jungleRecord.blueberriesCollected;
    })

    res.status(200).json({kiwisCollected, lemonsCollected, orangesCollected, applesCollected, blueberriesCollected});

  } catch (error) {
    console.error('Error loading jungle stretch:', error);
    res.status(500).json({ message: 'Error loading jungle stretch' });
  }
} 