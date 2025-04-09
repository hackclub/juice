import { base } from "@/lib/airtable";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get the user's token from the query
  const { token } = req.query;
  
  console.log("Received token from query:", token);

  // Check if the password is provided and correct
//   const { password } = req.query;
//   if (!password || password !== process.env.MAGAZINE_API_PASSWORD) {
//     return res.status(401).json({xr message: 'Unauthorized: Invalid or missing password' });
//   }

  try {
    // Fetch records from the YSWS Project Submission table
    const records = await base('YSWS Project Submission')
      .select({
        filterByFormula: "NOT({DoNotIncludeOnWebsite})"
      })
      .all();

    // Return only the specified fields
    const submissions = await Promise.all(records.map(async record => {
      const fields = record.fields;
      console.log(`Record ID: ${record.id}, Token in DB: ${fields["token"]}, User Token: ${token}`);
      
      // Handle the case where token might be an array
      const dbToken = Array.isArray(fields["token"]) ? fields["token"][0] : fields["token"];
      console.log(`Processed DB Token: ${dbToken}, User Token: ${token}`);
      
      // Fetch juice stretch data if available
      let juiceStretchData = null;
      if (fields["juiceStretches"] && fields["juiceStretches"].length > 0) {
        const stretchRecords = await base('juiceStretches')
          .select({
            filterByFormula: `OR(${fields["juiceStretches"].map(id => `RECORD_ID() = '${id}'`).join(',')})`
          })
          .all();
        
        juiceStretchData = stretchRecords.map(stretch => ({
          id: stretch.id,
          startTime: stretch.fields.startTime,
          endTime: stretch.fields.endTime,
          timeWorkedSeconds: stretch.fields.timeWorkedSeconds,
          timeWorkedHours: stretch.fields.timeWorkedHours,
          totalPauseTimeSeconds: stretch.fields.totalPauseTimeSeconds,
          isCancelled: stretch.fields.isCancelled,
          video: stretch?.fields["video (from omgMoments)"] ? (stretch?.fields["video (from omgMoments)"][0]) : "",
          description: stretch?.fields["description (from omgMoments)"] ? (stretch?.fields["description (from omgMoments)"][0]) : "",
          createdTime: stretch.fields.created,
        }));
      }
      
      return {
        id: record.id,
        "Code URL": fields["Code URL"] || null,
        "Playable URL": fields["Playable URL"] || null,
        "videoURL": fields["videoURL"] || null,
        "First Name": fields["First Name"] || null,
        "Last Name": fields["Last Name"] || null,
        "GitHub Username": fields["GitHub Username"] || null,
        "Description": fields["Description"] || null,
        "Screenshot": fields["Screenshot"] || null,
        "juiceStretches": juiceStretchData || null,
        "SlackHandle": fields["SlackHandle"] || null,
        "SlackID": fields["SlackID"] || null,
        "IsOwnedByMe": token && dbToken === token
      };
    }));

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching magazine submissions:', error);
    res.status(500).json({ message: 'Error fetching magazine submissions', error: error.message });
  }
} 