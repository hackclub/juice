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
    const { itchLink, platforms } = req.body;

    if (!itchLink || !platforms?.length) {
      return res.status(400).json({
        message: "Itch.io link and platforms are required",
      });
    }

    const omgMoments = await base("omgMoments")
      .select({
        filterByFormula: `{email} = '${req.user.email}'`,
        sort: [{ field: "created_at", direction: "desc" }],
      })
      .all();

    console.log("User Email:", req.user.email);
    console.log("Found OMG moments:", omgMoments.length);
    console.log(
      "OMG moment IDs:",
      omgMoments.map((record) => record.id),
    );

    const shipRecord = await base("Ships").create([
      {
        fields: {
          Link: itchLink,
          Platforms: platforms,
          user: [req.userId],
          Type: "base-mechanic",
          omgMomentsThatWentIntoThis: omgMoments.map((record) => record.id),
        },
      },
    ]);

    await base("Signups").update([
      {
        id: req.userId,
        fields: {
          achievements: [...(req.user.achievements || []), "poc_submitted"],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message:
        "Itch.io link submitted! Team will get back to you when they review it. Keep juicing",
      record: shipRecord[0],
    });
  } catch (error) {
    console.error("Ship submission error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error processing ship submission",
      error: error.error || "UNKNOWN_ERROR",
    });
  }
});
