import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export async function authenticateRequest(req) {
  const authToken = req.headers.authorization?.split(' ')[1] || req.body?.token;

  if (!authToken) {
    return { authenticated: false, error: 'No auth token provided', status: 401 };
  }

  try {
    const safeAuthToken = authToken.replace(/'/g, "\\'");

    const records = await base("Signups").select({
      filterByFormula: `{token} = '${safeAuthToken}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
      return { authenticated: false, error: 'Invalid token', status: 401 };
    }

    return {
      authenticated: true,
      user: records[0].fields,
      recordId: records[0].id
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, error: 'Authentication failed', status: 500 };
  }
}

export function withAuth(handler) {
  return async (req, res) => {
    const auth = await authenticateRequest(req);

    if (!auth.authenticated) {
      return res.status(auth.status).json({ message: auth.error });
    }

    req.user = auth.user;
    req.userId = auth.recordId;

    return handler(req, res);
  };
}
