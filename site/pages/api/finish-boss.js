import Airtable from 'airtable';
import { v4 as uuidv4 } from 'uuid';

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  return res.status(403).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, githubLink, itchLink } = req.body;
    
    // Get user's email from Signups table
    const signupRecords = await base('Signups').select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const signupRecord = signupRecords[0];
    const stretchId = uuidv4();
    // console.log("singup " + signupRecord.id)

    const records = await base('jungleBosses').select({}).firstPage();
    const jungleBossesFoughtRecords = await base("jungleBossesFought").select({
      filterByFormula: `{user} = '${signupRecord.fields.email}'`
    }).firstPage();
    const jungleBossesFoughtIds = jungleBossesFoughtRecords.map(jungleBossFought => jungleBossFought.fields.jungleBoss[0])
    // Filter jungle bosses not fought
    const jungleBossesNotFought = records
      .filter(record => !jungleBossesFoughtIds.includes(record.id) && record.fields.hours)
      .sort((a, b) => a.fields.hours - b.fields.hours);
    console.log(jungleBossesNotFought);

    // Create new record in jungleStretches with a reference to the Signups record
    const bossFought = (await base('jungleBossesFought').create([
      {
        fields: {
          ID: stretchId,
          githubLink,
          itchLink,
          user: [signupRecord.id], // Link to the Signups record
          timeFought: new Date().toISOString(),
          jungleBoss: [jungleBossesNotFought[0].id]
        }
      }
    ]))[0];


    const jungleStretchesRecords = await base('jungleStretches').select({
      filterByFormula: `
            AND(
            {email (from Signups)} = '${signupRecord.fields.email}',
            ({endtime}),
            NOT({isCanceled})
            )
        `
    }).all();

    if (!jungleStretchesRecords || jungleStretchesRecords.length === 0) {
      return res.status(404).json({ message: 'Jungle stretch not found' });
    }

    let maxHours = jungleBossesNotFought[0].fields.hours

    for (let i = 0; i < jungleStretchesRecords.length; i++) {
      const jungleStretchesRecord = jungleStretchesRecords[i];
      const currentBossesFought = jungleStretchesRecord.fields.jungleBossesFought || [];

      // Await the update operation
      const jungleStretch = await base("jungleStretches").update([
        {
          id: jungleStretchesRecord.id,
          fields: {
            jungleBossesFought: [...currentBossesFought, bossFought.id],
            jungleBossesFoughtFiltered: [...currentBossesFought, bossFought.id],
            countsForBoss: maxHours >= 0 ? true : false,
          }
        }
      ]);
      maxHours -= jungleStretch[0].fields.timeWorkedHours;
    }
    
    res.status(200).json({ stretchId });
  } catch (error) {
    console.error('Error starting jungle stretch:', error);
    res.status(500).json({ message: 'Error starting jungle stretch' });
  }
} 