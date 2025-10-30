import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  return res.status(403).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const juiceStart = new Date(Date.now() - 1000000 * 60 * 60 * 1000).toISOString();

    const records = await base('Ships')
      .select({
        filterByFormula: `IS_AFTER({created_at}, '${juiceStart}')`,
        sort: [{ field: 'created_at', direction: 'desc' }]
      })
      .all();

    function ensureValidUrl(gameUrl) {
      if (!gameUrl.startsWith("http://") && !gameUrl.startsWith("https://")) {
        gameUrl = "https://" + gameUrl;
      }
      return gameUrl;
    }

    function getPlatforms(record) {
      // Get the Platforms field which is a multiple select
      const platforms = record.fields.Platforms || [];
      // Default to Web if no platforms specified
      return platforms.length > 0 ? platforms : ['Web'];
    }

    const games = await Promise.all(
      records.map(async (record) => {
        return {
          email: record.fields.user,
          itchurl: record.fields.Link,
          gamename: record.fields.gameName,
          thumbnail: record.fields.gameImage,
          platforms: getPlatforms(record),
          description: record.fields.description || ''
        };
      })
    );

    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching gallery records:', error);
    res.status(500).json({ message: 'Error fetching gallery records' });
  }
}