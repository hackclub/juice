import Airtable from 'airtable';

/** The airtable database connection instance */
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

export default base;
