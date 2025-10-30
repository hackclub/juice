import Airtable from "airtable";
import { v4 as uuidv4 } from "uuid";
import { withAuth } from "./_middleware";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

export default withAuth(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const stretchId = uuidv4();

    await base("juiceStretches").create([
      {
        fields: {
          ID: stretchId,
          Signups: [req.userId],
          startTime: new Date().toISOString(),
        },
      },
    ]);

    res.status(200).json({ stretchId });
  } catch (error) {
    console.error("Error starting juice stretch:", error);
    res.status(500).json({ message: "Error starting juice stretch" });
  }
});
