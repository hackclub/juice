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
    const { prLink } = req.body;

    if (!prLink) {
      return res.status(400).json({ message: "PR link is required" });
    }

    const updatedRecord = await base("Signups").update([
      {
        id: req.userId,
        fields: {
          game_pr: prLink,
          achievements: [...(req.user?.achievements || []), "pr_submitted"],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      record: updatedRecord[0],
    });
  } catch (error) {
    console.error("PR submission error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error processing PR submission",
      error: error.error || "UNKNOWN_ERROR",
    });
  }
});
