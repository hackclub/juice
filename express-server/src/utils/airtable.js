import dotenv from 'dotenv';
import Airtable from 'airtable';

// Load environment variables if not already loaded
dotenv.config();

if (!process.env.AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is not set in environment variables');
}

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export async function getUserByToken(token) {
  const signupRecords = await base('Signups').select({
    filterByFormula: `{token} = '${token}'`,
    maxRecords: 1
  }).firstPage();

  if (!signupRecords || signupRecords.length === 0) {
    throw new Error('User not found');
  }

  return signupRecords[0];
}

export async function createOmgMoment(description, email, videoUrl) {
  const omgMoments = await base('omgMoments').create([
    {
      fields: {
        description,
        email,
        video: videoUrl
      }
    }
  ]);

  return omgMoments[0];
}

export async function updateJuiceStretch(stretchId, stopTime, omgMomentId) {
  const stretchRecords = await base('juiceStretches').select({
    filterByFormula: `{ID} = '${stretchId}'`
  }).firstPage();

  if (!stretchRecords || stretchRecords.length === 0) {
    throw new Error(`Juice stretch not found with ID: ${stretchId}`);
  }

  const stretchRecord = stretchRecords[0];
  
  await base('juiceStretches').update([{
    id: stretchRecord.id,
    fields: {
      endTime: stopTime,
      omgMoments: [omgMomentId]
    }
  }]);

  return stretchRecord;
} 

export async function updateJungleStretch(stretchId, stopTime, omgMomentId) {
  const stretchRecords = await base('jungleStretches').select({
    filterByFormula: `{ID} = '${stretchId}'`
  }).firstPage();

  if (!stretchRecords || stretchRecords.length === 0) {
    throw new Error(`Juice stretch not found with ID: ${stretchId}`);
  }

  const stretchRecord = stretchRecords[0];
  
  await base('jungleStretches').update([{
    id: stretchRecord.id,
    fields: {
      endTime: stopTime,
      omgMoments: [omgMomentId]
    }
  }]);

  return stretchRecord;
} 