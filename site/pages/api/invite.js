import Airtable from "airtable";
import { withAuth } from "./_middleware";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

export default withAuth(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { invitedParticipantEmail, flavor } = req.body;

    if (!invitedParticipantEmail || !flavor) {
      return res.status(400).json({ message: "Email and flavor are required" });
    }

    const senderEmail = req.user.email || "";
    const invitesAvailable = req.user.invitesAvailable || [];

    if (!invitesAvailable.includes(flavor)) {
      return res.status(400).json({ message: "Invite flavor not available" });
    }

    const updatedInvites = invitesAvailable.filter(
      (invite) => invite !== flavor,
    );

    await base("signups").update([
      {
        id: req.userId,
        fields: {
          invitesAvailable: updatedInvites,
        },
      },
    ]);

    const record = await base("Invites").create([
      {
        fields: {
          invitedParticipantEmail,
          sentFrom: senderEmail,
          flavor,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      record,
      remainingInvites: updatedInvites,
    });
  } catch (error) {
    console.error("Invite creation error:", error);
    return res.status(500).json({
      message: error.message || "Error creating invite",
      error: error.error || "UNKNOWN_ERROR",
    });
  }
});
