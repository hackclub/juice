import { getAirtableBase } from '../utils/airtable.js';

export async function getUserData(req, res) {
  console.log('getUserData called');
  const base = getAirtableBase();
  
  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authToken = req.headers.authorization?.split(' ')[1];
  if (!authToken) {
    console.log('No auth token provided');
    return res.status(401).json({ message: 'No auth token provided' });
  }

  try {
    // Escape single quotes in authToken to prevent injection
    const safeAuthToken = authToken.replace(/'/g, "\\'");
    
    // Get user data
    const records = await base(process.env.AIRTABLE_TABLE_NAME).select({
      filterByFormula: `{token} = '${safeAuthToken}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = { ...records[0].fields };
    const safeEmail = userData.email.replace(/'/g, "\\'");

    // Run all main queries in parallel
    const [
      juiceStretches,
      jungleStretches,
      omgMoments,
      tokenFruitConversionRecords
    ] = await Promise.all([
      base('juiceStretches').select({
        filterByFormula: `AND({email (from Signups)} = '${safeEmail}', NOT({omgMoments} = ''))`
      }).firstPage(),
      
      base('jungleStretches').select({
        filterByFormula: `AND({email (from Signups)} = '${safeEmail}', {endTime}, NOT({isCanceled}))`
      }).firstPage(),
      
      base('omgMoments').select({
        filterByFormula: `{email} = '${safeEmail}'`
      }).all(),
      
      base("fruitPricesProbabilities - Do not modify").select().firstPage()
    ]);

    // Process juice stretches
    let totalHours = 0;
    const omgMomentPromises = [];
    
    userData.juiceStretches = juiceStretches.map(record => {
      const stretchTime = record.fields.timeWorkedSeconds ?? 0;
      totalHours += Math.round(stretchTime / 3600 * 100) / 100;

      // Queue up OMG moment fetches
      if (record.fields.omgMoments) {
        record.fields.omgMoments.forEach(omgId => {
          omgMomentPromises.push(
            base('omgMoments').find(omgId)
              .then(omgRecord => ({
                created_at: omgRecord.fields.created_at,
                kudos: omgRecord.fields.kudos,
                video: omgRecord.fields.video,
                description: omgRecord.fields.description
              }))
          );
        });
      }

      return record.fields;
    });

    // Process jungle stretches - match the same pattern as juice stretches
    userData.jungleStretches = jungleStretches.map(record => record.fields);

    // Calculate jungle metrics
    const fruitTypes = ['kiwis', 'lemons', 'oranges', 'apples', 'blueberries'];
    const fruitCounts = { collected: {}, redeemable: {} };
    
    userData.jungleStretches.forEach(stretch => {
      const category = !stretch.countsForBoss ? 'collected' : 
                      !stretch.isRedeemed ? 'redeemable' : null;
      
      if (category) {
        fruitTypes.forEach(fruit => {
          fruitCounts[category][fruit] = (fruitCounts[category][fruit] || 0) + 
                                       (stretch[fruit + 'Collected'] || 0);
        });
      }
    });
    
    // Calculate total jungle hours
    userData.totalJungleHours = userData.jungleStretches.reduce((total, stretch) => {
      return total + Math.round((stretch.timeWorkedSeconds || 0) / 3600 * 100) / 100;
    }, 0);

    // Calculate tokens
    const conversionRates = Object.fromEntries(
      tokenFruitConversionRecords
        .map(record => [record.fields.fruit, record.fields.tokens || 0])
    );

    userData.totalTokens = Object.entries(fruitCounts.collected)
      .reduce((sum, [fruit, count]) => sum + (count * (conversionRates[fruit] || 0)), 0);

    userData.totalRedeemableTokens = Object.entries(fruitCounts.redeemable)
      .reduce((sum, [fruit, count]) => sum + (count * (conversionRates[fruit] || 0)), 0);

    // Calculate total kudos
    userData.totalKudos = omgMoments.reduce((sum, moment) => sum + (moment.fields.kudos || 0), 0);

    // Get postcard data directly from the user record's linked Postcards
    if (records[0].fields.Postcards) {
      const postcardRecords = await Promise.all(
        records[0].fields.Postcards.map(postcardId => 
          base('Postcards').find(postcardId)
        )
      );

      userData.Postcards = postcardRecords.map(record => ({
        id: record.id,
        ...record.fields
      }));
    } else {
      userData.Postcards = [];
    }

    // Get Tamagotchi data
    if (records[0].fields.Tamagotchi) {
      const tamagotchiRecords = await Promise.all(
        records[0].fields.Tamagotchi.map(tamagotchiId => 
          base('Tamagotchi').find(tamagotchiId)
        )
      );

      userData.Tamagotchi = tamagotchiRecords.map(record => ({
        id: record.id,
        ...record.fields
      }));
    } else {
      userData.Tamagotchi = [];
    }

    res.status(200).json({ userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
} 