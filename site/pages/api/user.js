/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
  return res.status(405).json({ message: 'API MOVED' });

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // const authToken = req.headers.authorization?.split(' ')[1];
  // if (!authToken) {
  //   return res.status(401).json({ message: 'No auth token provided' });
  // }

  // try {
  //   // Escape single quotes in authToken to prevent injection
  //   const safeAuthToken = authToken.replace(/'/g, "\\'");
    
  //   // Get user data
  //   const records = await base(process.env.AIRTABLE_TABLE_NAME).select({
  //     filterByFormula: `{token} = '${safeAuthToken}'`,
  //     maxRecords: 1
  //   }).firstPage();

  //   if (records.length === 0) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }

  //   const userData = records[0].fields;
  //   const safeEmail = userData.email.replace(/'/g, "\\'");

  //   // Run all main queries in parallel
  //   const [
  //     juiceStretches,
  //     jungleStretches,
  //     omgMoments,
  //     tokenFruitConversionRecords
  //   ] = await Promise.all([
  //     base('juiceStretches').select({
  //       filterByFormula: `AND({email (from Signups)} = '${safeEmail}', NOT({omgMoments} = ''))`,
  //       fields: ['ID', 'startTime', 'endTime', 'timeWorkedHours', 'timeWorkedSeconds', 'totalPauseTimeSeconds', 'Review', 'omgMoments']
  //     }).firstPage(),
      
  //     base('jungleStretches').select({
  //       filterByFormula: `AND({email (from Signups)} = '${safeEmail}', {endtime}, NOT({isCanceled}))`,
  //       fields: ['timeWorkedSeconds', 'countsForBoss', 'isRedeemed', 
  //               'kiwisCollected', 'lemonsCollected', 'orangesCollected', 
  //               'applesCollected', 'blueberriesCollected']
  //     }).firstPage(),
      
  //     base('omgMoments').select({
  //       filterByFormula: `{email} = '${safeEmail}'`,
  //       fields: ['kudos']
  //     }).all(),
      
  //     base("fruitPricesProbabilities - Do not modify").select({
  //       fields: ['fruit', 'tokens']
  //     }).firstPage()
  //   ]);

  //   // Process juice stretches
  //   let totalHours = 0;
  //   const omgMomentPromises = [];
    
  //   userData.juiceStretches = juiceStretches.map(record => {
  //     const stretchTime = record.fields.timeWorkedSeconds ?? 0;
  //     totalHours += Math.round(stretchTime / 3600 * 100) / 100;

  //     // Queue up OMG moment fetches
  //     if (record.fields.omgMoments) {
  //       record.fields.omgMoments.forEach(omgId => {
  //         omgMomentPromises.push(
  //           base('omgMoments').find(omgId)
  //             .then(omgRecord => ({
  //               created_at: omgRecord.fields.created_at,
  //               kudos: omgRecord.fields.kudos,
  //               video: omgRecord.fields.video,
  //               description: omgRecord.fields.description
  //             }))
  //         );
  //       });
  //     }

  //     return record.fields;
  //   });

  //   // Resolve all OMG moment fetches in parallel
  //   const omgMomentDetails = await Promise.all(omgMomentPromises);
  //   userData.juiceStretches.forEach((stretch, index) => {
  //     stretch.omgMoments = omgMomentDetails.slice(
  //       index * (stretch.omgMoments?.length || 0),
  //       (index + 1) * (stretch.omgMoments?.length || 0)
  //     );
  //   });

  //   userData.totalJuiceHours = totalHours;

  //   // Calculate jungle metrics
  //   const fruitTypes = ['kiwis', 'lemons', 'oranges', 'apples', 'blueberries'];
  //   const fruitCounts = { collected: {}, redeemable: {} };
    
  //   jungleStretches.forEach(record => {
  //     const category = !record.fields.countsForBoss ? 'collected' : 
  //                     !record.fields.isRedeemed ? 'redeemable' : null;
      
  //     if (category) {
  //       fruitTypes.forEach(fruit => {
  //         fruitCounts[category][fruit] = (fruitCounts[category][fruit] || 0) + 
  //                                      (record.fields[fruit + 'Collected'] || 0);
  //       });
  //     }
      
  //     // Calculate total jungle hours
  //     userData.totalJungleHours = jungleStretches.reduce((total, record) => {
  //       return total + Math.round((record.fields.timeWorkedSeconds || 0) / 3600 * 100) / 100;
  //     }, 0);
  //   });

  //   // Calculate tokens
  //   const conversionRates = Object.fromEntries(
  //     tokenFruitConversionRecords
  //       .map(record => [record.fields.fruit, record.fields.tokens || 0])
  //   );

  //   userData.totalTokens = Object.entries(fruitCounts.collected)
  //     .reduce((sum, [fruit, count]) => sum + (count * (conversionRates[fruit] || 0)), 0);

  //   userData.totalRedeemableTokens = Object.entries(fruitCounts.redeemable)
  //     .reduce((sum, [fruit, count]) => sum + (count * (conversionRates[fruit] || 0)), 0);

  //   // Calculate total kudos
  //   userData.totalKudos = omgMoments.reduce((sum, moment) => sum + (moment.fields.kudos || 0), 0);

  //   res.status(200).json({ userData });
  // } catch (error) {
  //   console.error('Error fetching user data:', error);
  //   res.status(500).json({ message: 'Error fetching user data' });
  // }
} 