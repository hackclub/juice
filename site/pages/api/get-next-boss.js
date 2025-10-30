import Airtable from "airtable";
import { ReplaceStencilOp } from "three";
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
    const records = await base("jungleBosses").select({}).firstPage();

    // const jungleBossesFought = signupRecord.fields.jungleBossesFought || [];
    // console.log(jungleBossesFought)
    // Fetch jungle bosses fought by Airtable record ID
    const jungleBossesFoughtRecords = await base("jungleBossesFought")
      .select({
        filterByFormula: `{user} = '${req.user.email}'`,
      })
      .firstPage();

    const jungleBossesFoughtIds = jungleBossesFoughtRecords.map(
      (jungleBossFought) => jungleBossFought.fields.jungleBoss[0],
    );
    console.log(jungleBossesFoughtIds);

    // Filter jungle bosses not fought and sort by hours
    const jungleBossesNotFought = records
      .filter(
        (record) =>
          !jungleBossesFoughtIds.includes(record.id) && record.fields.hours,
      )
      .sort((a, b) => a.fields.hours - b.fields.hours);

    // console.log(jungleBossesNotFought);
    if (!jungleBossesNotFought || jungleBossesNotFought.length === 0) {
      return res
        .status(200)
        .json({ message: "No jungle bosses left to fight" });
    }

    // Calculate time to fight the next boss not fought
    res.status(200).json({
      timeToNextBoss:
        jungleBossesNotFought[0].fields.hours - req.user.totalJungleHours,
      boss: jungleBossesNotFought[0].fields,
    });
  } catch (error) {
    console.error("Error resuming jungle stretch:", error);
    res.status(500).json({ message: "Error resuming jungle stretch" });
  }
});
