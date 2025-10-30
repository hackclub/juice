import Airtable from 'airtable';
import { v4 as uuidv4 } from 'uuid';

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  return res.status(403).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, stretchId } = req.body;
    
    // Get user's email from Signups table
    const signupRecords = await base('Signups').select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const signupRecord = signupRecords[0];

    const records = await base('jungleStretches').select({
      filterByFormula: `{ID} = '${stretchId}'`,
      maxRecords: 1
    }).firstPage();

    if (!records || records.length === 0) {
      return res.status(404).json({ message: 'jungle stretch not found' });
    }

    const timeToReward = Math.floor(Math.random() * (600000 - 300000 + 1)) + 300000; // Randomly generated between 300k and 600k ms -> 5m and 10m (average 7.5m)
    // const timeToReward = 0; // testing
    // We reward ~$4/h, so we need to reward ~$0.50 per session probabilty calculations have been made and are in airtable

    const lastCollectedFruitTime = records[0].fields.lastCollectedFruitTime;
    const startTime = records[0].fields.startTime;

    if(lastCollectedFruitTime){
      if(new Date().getTime() > new Date(lastCollectedFruitTime).getTime() + timeToReward) {
        const probabilityRecords = await base("fruitPricesProbabilities - Do not modify").select({}).firstPage();
        const probabilities = probabilityRecords.map(record => record.fields.probability);
        const fruits = probabilityRecords.map(record => record.fields.fruit);

        // Calculate cumulative probabilities
        const cumulativeProbabilities = probabilities.reduce((acc, prob, index) => {
          const sum = (acc[index - 1] || 0) + prob;
          acc.push(sum);
          return acc;
        }, []);

        const random = Math.random();

        // Select a fruit based on the random number and cumulative probabilities
        let selectedFruit;
        for (let i = 0; i < cumulativeProbabilities.length; i++) {
          if (random < cumulativeProbabilities[i]) {
            selectedFruit = fruits[i];
            break;
          }
        }
        if(selectedFruit == "kiwis") {
          const oldKiwisCollected = records[0].fields.kiwisCollected == undefined ? 0 : records[0].fields.kiwisCollected;
          await base('jungleStretches').update([
            {
              id: records[0].id,
              fields: {
                lastCollectedFruitTime: new Date().toISOString(),
                kiwisCollected: oldKiwisCollected + 1,
              }
            }
          ]);
        } else if(selectedFruit == "lemons") {
          const oldLemonsCollected = records[0].fields.lemonsCollected == undefined ? 0 : records[0].fields.lemonsCollected;
          await base('jungleStretches').update([
            {
              id: records[0].id,
              fields: {
                lastCollectedFruitTime: new Date().toISOString(),
                lemonsCollected: oldLemonsCollected + 1,
              }
            }
          ]);
        } else if(selectedFruit == "oranges") {
          const oldOrangesCollected = records[0].fields.orangesCollected == undefined ? 0 : records[0].fields.orangesCollected;
          await base('jungleStretches').update([
            {
              id: records[0].id,
              fields: {
                lastCollectedFruitTime: new Date().toISOString(),
                orangesCollected: oldOrangesCollected + 1,
              }
            }
          ]);
        } else if(selectedFruit == "apples") {
          const oldApplesCollected = records[0].fields.applesCollected == undefined ? 0 : records[0].fields.applesCollected;
          await base('jungleStretches').update([
            {
              id: records[0].id,
              fields: {
                lastCollectedFruitTime: new Date().toISOString(),
                applesCollected: oldApplesCollected + 1,
              }
            }
          ]);
        } else if(selectedFruit == "blueberries") {
          const oldBlueberriesCollected = records[0].fields.blueberriesCollected == undefined ? 0 : records[0].fields.blueberriesCollected;
          await base('jungleStretches').update([
            {
              id: records[0].id,
              fields: {
                lastCollectedFruitTime: new Date().toISOString(),
                blueberriesCollected: oldBlueberriesCollected + 1,
              }
            }
          ]);
        }
      }
    } else {
      if(new Date().getTime() > new Date(startTime).getTime() + timeToReward){
        const probabilityRecords = await base("fruitPricesProbabilities - Do not modify").select({}).firstPage();
        const probabilities = probabilityRecords.map(record => record.fields.probability);
        const fruits = probabilityRecords.map(record => record.fields.fruit);

        // Calculate cumulative probabilities
        const cumulativeProbabilities = probabilities.reduce((acc, prob, index) => {
          const sum = (acc[index - 1] || 0) + prob;
          acc.push(sum);
          return acc;
        }, []);

        const random = Math.random();

        // Select a fruit based on the random number and cumulative probabilities
        let selectedFruit;
        for (let i = 0; i < cumulativeProbabilities.length; i++) {
          if (random < cumulativeProbabilities[i]) {
            selectedFruit = fruits[i];
            break;
          }
        }
        if(selectedFruit == "kiwis") {
          const oldKiwisCollected = records[0].fields.kiwisCollected == undefined ? 0 : records[0].fields.kiwisCollected;
          await base('jungleStretches').update([
            {
              id: records[0].id,
              fields: {
                lastCollectedFruitTime: new Date().toISOString(),
                kiwisCollected: oldKiwisCollected + 1,
              }
            }
          ]);
        } else if(selectedFruit == "lemons") {
          const oldLemonsCollected = records[0].fields.lemonsCollected == undefined ? 0 : records[0].fields.lemonsCollected;
          await base('jungleStretches').update([
            {
              id: records[0].id,
              fields: {
                lastCollectedFruitTime: new Date().toISOString(),
                lemonsCollected: oldLemonsCollected + 1,
              }
            }
          ]);
        } else if(selectedFruit == "oranges") {
          const oldOrangesCollected = records[0].fields.orangesCollected == undefined ? 0 : records[0].fields.orangesCollected;
          await base('jungleStretches').update([
            {
              id: records[0].id,
              fields: {
                lastCollectedFruitTime: new Date().toISOString(),
                orangesCollected: oldOrangesCollected + 1,
              }
            }
          ]);
        } else if(selectedFruit == "apples") {
          const oldApplesCollected = records[0].fields.applesCollected == undefined ? 0 : records[0].fields.applesCollected;
          await base('jungleStretches').update([
            {
              id: records[0].id,
              fields: {
                lastCollectedFruitTime: new Date().toISOString(),
                applesCollected: oldApplesCollected + 1,
              }
            }
          ]);
        } else if(selectedFruit == "blueberries") {
          const oldBlueberriesCollected = records[0].fields.blueberriesCollected == undefined ? 0 : records[0].fields.blueberriesCollected;
          await base('jungleStretches').update([
            {
              id: records[0].id,
              fields: {
                lastCollectedFruitTime: new Date().toISOString(),
                blueberriesCollected: oldBlueberriesCollected + 1,
              }
            }
          ]);
        }
      }
    }
    

    await base('jungleStretches').update([
      {
        id: records[0].id,
        fields: {
          pauseTimeStart: new Date().toISOString()
        }
      }
    ]);

    res.status(200).json({});
  } catch (error) {
    console.error('Error pausing jungle stretch:', error);
    res.status(500).json({ message: 'Error pausing jungle stretch' });
  }
} 