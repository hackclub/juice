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
    const stretchRecordsData = (
      await base("jungleStretches")
        .select({
          filterByFormula: `
        AND(
          {email (from Signups)} = '${req.user.email}',
          NOT({endtime}),
          NOT({isCanceled}),
          {pauseTimeStart}
        )
      `,
        })
        .firstPage()
    ).map((record) => record.fields);

    if (stretchRecordsData.length === 0) {
      res.status(200).json({});
      return;
    }

    const lastRecord = stretchRecordsData[0];

    console.log(lastRecord);
    const previousPauseTime =
      lastRecord.totalPauseTimeSeconds == undefined
        ? 0
        : lastRecord.totalPauseTimeSeconds;
    const newPauseTime = Math.round(
      previousPauseTime +
        Math.abs(new Date() - new Date(lastRecord.pauseTimeStart)) / 1000,
    );
    res
      .status(200)
      .json({
        id: lastRecord.ID,
        startTime: lastRecord.startTime,
        totalPauseTimeSeconds: newPauseTime,
        kiwisCollected: lastRecord.kiwisCollected,
        lemonsCollected: lastRecord.lemonsCollected,
        orangesCollected: lastRecord.orangesCollected,
        applesCollected: lastRecord.applesCollected,
        blueberriesCollected: lastRecord.blueberriesCollected,
      });
  } catch (error) {
    console.error("Error loading jungle stretch:", error);
    res.status(500).json({ message: "Error loading jungle stretch" });
  }
});
