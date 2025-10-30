import Airtable from "airtable";
import { withAuth } from "./_middleware";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default withAuth(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { gameWebsiteUrl, githubLink } = req.body;

    if (!gameWebsiteUrl || !githubLink) {
      return res.status(400).json({
        success: false,
        message: "Game website URL and GitHub link are required",
      });
    }

    const omgMoments = await base("omgMoments")
      .select({
        filterByFormula: `{email} = '${req.user.email}'`,
        sort: [{ field: "created_at", direction: "desc" }],
      })
      .all();

    const shipRecord = await base("Ships").create([
      {
        fields: {
          Link: gameWebsiteUrl,
          user: [req.userId],
          Type: "v1",
          omgMomentsThatWentIntoThis: omgMoments.map((record) => record.id),
        },
      },
    ]);

    await base("Signups").update([
      {
        id: req.userId,
        fields: {
          achievements: [...(req.user.achievements || []), "v1_submitted"],
          GitHubLink: githubLink,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message:
        "V1 of your game has been submitted! look forward to trying your game ~Thomas",
      record: shipRecord[0],
    });
  } catch (error) {
    console.error("V1 submission error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error processing V1 submission",
      error: error.error || "UNKNOWN_ERROR",
    });
  }
});
