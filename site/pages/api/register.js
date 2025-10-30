import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase();

    const existingRecords = await base("Signups")
      .select({
        filterByFormula: `LOWER({email}) = '${normalizedEmail}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (existingRecords.length > 0) {
      const tokenResendRecords = await base("tokenResends")
        .select({
          filterByFormula: `AND(LOWER({email}) = '${normalizedEmail}', DATETIME_DIFF(NOW(), CREATED_TIME(), 'minutes') < 5)`,
          maxRecords: 1,
        })
        .firstPage();

      if (tokenResendRecords.length === 0) {
        await base("tokenResends").create([
          {
            fields: {
              email: normalizedEmail,
            },
          },
        ]);
      }

      return res.status(200).json({
        success: true,
        message: "Token resend requested",
        isResend: true,
      });
    }

    return res.status(403).json({
      success: false,
      message:
        "New signups are disabled. If you already have an account, please check your email spelling.",
      error: "SIGNUPS_DISABLED",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error processing registration",
      error: error.error || "UNKNOWN_ERROR",
    });
  }
}
