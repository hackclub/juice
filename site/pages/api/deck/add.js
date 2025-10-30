import Airtable from "airtable";
import { withAuth } from "../_middleware";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

export default withAuth(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      gameTitle,
      characterName,
      HP,
      moveName,
      moveDescription,
      specialMoveName,
      specialMoveDescription,
      itchLink,
      shader,
      image,
    } = req.body;

    const record = await base("deck").create({
      creator: [req.userId],
      gameTitle,
      characterName,
      HP,
      moveName,
      moveDescription,
      specialMoveName,
      specialMoveDescription,
      itchLink,
      shader,
      image: image,
    });

    return res.status(200).json({
      message: "Card added successfully",
      record: record.fields,
    });
  } catch (error) {
    console.error("Error adding card to deck:", error);
    return res.status(500).json({ error: "Failed to add card to deck" });
  }
});
