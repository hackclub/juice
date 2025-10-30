import Airtable from 'airtable';
import { withAuth } from './_middleware';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

export default withAuth(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Define the cutoff time: 5 minutes ago in UTC
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const fiveMinutesAgoIso = fiveMinutesAgo.toISOString();

    // Get all active juice stretches based on three criteria:
    // 1. pauseTimeStart is within the last 5 minutes
    // 2. Not cancelled
    // 3. No end time (not completed)
    const activeRecords = await base('juiceStretches').select({
        filterByFormula: `AND(
        NOT({endTime} != ''),
        NOT({isCanceled} = TRUE()),
        {pauseTimeStart} >= '${fiveMinutesAgoIso}'
      )`
      }).firstPage();

    // Count the active stretches
    const activeJuicersCount = activeRecords ? activeRecords.length : 0;

    // Calculate total time worked across all ACTIVE stretches
    let totalTimeWorkedSeconds = 0;
    const stretches = [];
    const activeJuicers = [];

    console.log('--- Active Stretch Details ---');

    if (activeRecords && activeRecords.length > 0) {
      activeRecords.forEach((record, index) => {
        const fields = record.fields;

        if (fields.startTime) {
          const startTime = new Date(fields.startTime);
          let endTime;

          // For active stretches, we either use pauseTimeStart or current time
          if (fields.pauseTimeStart) {
            endTime = new Date(fields.pauseTimeStart);
          } else {
            endTime = new Date();
          }

          // Calculate duration in seconds
          const durationSeconds = (endTime - startTime) / 1000;

          // Subtract pause time if available
          const pauseTimeSeconds = fields.totalPauseTimeSeconds || 0;
          const workTimeSeconds = Math.max(0, durationSeconds - pauseTimeSeconds);
          const workTimeHours = workTimeSeconds / 3600;

          // Information for this stretch - removing any personally identifiable information
          const stretchInfo = {
            // Use a generic identifier instead of the actual ID
            stretchNumber: index + 1,
            startTime: startTime.toISOString(),
            timeWorkedHours: workTimeHours,
            timeWorkedSeconds: workTimeSeconds
          };

          stretches.push(stretchInfo);

          // Extract SlackHandle or use "Juicer" as fallback
          const slackHandle = fields.SlackHandle || "Juicer";

          // Add to active juicers list with slack handle
          activeJuicers.push({
            slackHandle,
            startTime: startTime.toISOString(),
            lastActive: fields.pauseTimeStart,
            timeWorkedHours: workTimeHours.toFixed(2)
          });

          // Log each active stretch individually without any identifiable information
          console.log(`Stretch #${index + 1}`);
          console.log(`  User: ${slackHandle}`);
          console.log(`  Time worked: ${workTimeHours.toFixed(2)} hours (${workTimeSeconds.toFixed(0)} seconds)`);
          console.log(`  Start time: ${startTime.toISOString()}`);
          console.log(`  Last active: ${fields.pauseTimeStart}`);
          if (fields.totalPauseTimeSeconds) {
            console.log(`  Total pause time: ${fields.totalPauseTimeSeconds} seconds`);
          }
          console.log('---');

          totalTimeWorkedSeconds += workTimeSeconds;
        }
      });
    } else {
      console.log('No active stretches found.');
    }

    // Convert to hours for logging
    const totalTimeWorkedHours = totalTimeWorkedSeconds / 3600;

    console.log(`--- Summary ---`);
    console.log(`Active juicers: ${activeJuicersCount}`);
    console.log(`Total active time worked: ${totalTimeWorkedHours.toFixed(2)} hours (${totalTimeWorkedSeconds.toFixed(0)} seconds)`);
    console.log(`Total active stretches: ${stretches.length}`);

    // Return the aggregate data along with active juicers info
    res.status(200).json({
      count: activeJuicersCount,
      totalActiveTimeWorkedSeconds: totalTimeWorkedSeconds,
      totalActiveTimeWorkedHours: totalTimeWorkedHours,
      activeJuicers // Include the list of active juicers with their slack handles
    });
  } catch (error) {
    console.error('Error getting active juicers count:', error);
    res.status(500).json({ message: 'Error getting active juicers count' });
  }
});