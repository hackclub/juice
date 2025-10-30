import Airtable from 'airtable';
import { withAuth } from './_middleware';
import {escapeAirtableString, normalizeEmail, isValidEmail} from '../../lib/airtable-utils'


const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID,
);

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    const sanitisedToken = escapeAirtableString(token);
    
    // Get user's record from Signups table
    const signupRecords = await base('Signups').select({
      filterByFormula: `{token} = '${sanitisedToken}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const signupRecord = signupRecords[0];
    const userEmail = signupRecord.fields.email;

    // Get user's Tamagotchi
    const tamagotchiRecords = await base('Tamagotchi').select({
      filterByFormula: `{user} = '${userEmail}'`,
      maxRecords: 1
    }).firstPage();

    if (!tamagotchiRecords || tamagotchiRecords.length === 0) {
      return res.status(404).json({ message: 'Tamagotchi not found' });
    }

    const tamagotchi = tamagotchiRecords[0];
    const startDate = new Date(tamagotchi.fields.startDate);
    const now = new Date();

    // Calculate current day number (1-indexed)
    const dayNumber = Math.floor((now - startDate) / (24 * 60 * 60 * 1000)) + 1;

    // Get all stretches (both juice and jungle)
    const juiceStretches = await base('juiceStretches').select({
      filterByFormula: `AND({email (from Signups)} = '${userEmail}', NOT({isCanceled}))`
    }).all();
    
    const jungleStretches = await base('jungleStretches').select({
      filterByFormula: `AND({email (from Signups)} = '${userEmail}', NOT({isCanceled}))`
    }).all();
    
    // Get all OMG moments for this user
    const omgMoments = await base('omgMoments').select({
      filterByFormula: `{email} = '${userEmail}'`
    }).all();

    // Calculate total hours for today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    let todayJuiceHours = 0;
    let todayJungleHours = 0;

    // Process juice stretches for today
    juiceStretches.forEach(stretch => {
      if (!stretch.fields.endTime) return; // Skip ongoing stretches

      const stretchEnd = new Date(stretch.fields.endTime);
      if (stretchEnd >= todayStart && stretchEnd <= now) {
        const stretchStart = new Date(stretch.fields.startTime);
        const pauseTimeSeconds = stretch.fields.totalPauseTimeSeconds || 0;

        // Calculate hours worked (accounting for pause time)
        const totalTimeMs = stretchEnd - stretchStart;
        const activeTimeMs = totalTimeMs - (pauseTimeSeconds * 1000);
        const hoursWorked = activeTimeMs / (1000 * 60 * 60);

        todayJuiceHours += hoursWorked;
      }
    });

    // Process jungle stretches for today
    jungleStretches.forEach(stretch => {
      if (!stretch.fields.endTime) return; // Skip ongoing stretches

      const stretchEnd = new Date(stretch.fields.endTime);
      if (stretchEnd >= todayStart && stretchEnd <= now) {
        const stretchStart = new Date(stretch.fields.startTime);
        const pauseTimeSeconds = stretch.fields.totalPauseTimeSeconds || 0;

        // Calculate hours worked (accounting for pause time)
        const totalTimeMs = stretchEnd - stretchStart;
        const activeTimeMs = totalTimeMs - (pauseTimeSeconds * 1000);
        const hoursWorked = activeTimeMs / (1000 * 60 * 60);

        todayJungleHours += hoursWorked;
      }
    });

    const todayTotalHours = todayJuiceHours + todayJungleHours;

    // Organize OMG moments by day
    const dayOmgMoments = {};
    const daysWithOmgMoments = new Set();

    // Initialize day data structure for up to 10 days
    const maxDays = Math.min(10, dayNumber);
    for (let i = 1; i <= maxDays; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(dayStart.getDate() + (i - 1));
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(startDate);
      dayEnd.setDate(dayEnd.getDate() + i);
      dayEnd.setHours(0, 0, 0, 0);

      dayOmgMoments[`Day${i}`] = [];

      // Find OMG moments for this day
      omgMoments.forEach(moment => {
        if (!moment.fields.created_at) return;

        const momentDate = new Date(moment.fields.created_at);
        if (momentDate >= dayStart && momentDate < dayEnd) {
          dayOmgMoments[`Day${i}`].push(moment.id);
          daysWithOmgMoments.add(i);
        }
      });
    }

    // Calculate streak based on consecutive days with OMG moments
    let currentStreak = 0;
    let maxStreak = 0;

    // Check if today has an OMG moment
    const todayHasOmgMoment = daysWithOmgMoments.has(dayNumber);

    // Calculate the streak
    for (let i = dayNumber; i >= 1; i--) {
      if (daysWithOmgMoments.has(i)) {
        currentStreak++;
      } else {
        break; // Break on first day without OMG moment
      }
    }

    // If today doesn't have an OMG moment, check yesterday's streak
    if (!todayHasOmgMoment && dayNumber > 1) {
      let yesterdayStreak = 0;
      for (let i = dayNumber - 1; i >= 1; i--) {
        if (daysWithOmgMoments.has(i)) {
          yesterdayStreak++;
        } else {
          break;
        }
      }
      maxStreak = Math.max(currentStreak, yesterdayStreak);
    } else {
      maxStreak = currentStreak;
    }

    // Prepare update fields
    const updateFields = {
      streakNumber: maxStreak // Use the streak of consecutive days with OMG moments
    };

    // Add OMG moments to day fields
    for (let i = 1; i <= maxDays; i++) {
      const dayKey = `Day${i}`;
      if (dayOmgMoments[dayKey].length > 0) {
        updateFields[dayKey] = dayOmgMoments[dayKey];
      }
    }

    // Update Tamagotchi record with day data and OMG moments
    await base('Tamagotchi').update([
      {
        id: tamagotchi.id,
        fields: updateFields
      }
    ]);

    // Store the day data in localStorage instead of Airtable
    res.status(200).json({
      success: true,
      currentDay: dayNumber,
      streakDays: maxStreak,
      todayHours: {
        juice: todayJuiceHours,
        jungle: todayJungleHours,
        total: todayTotalHours
      },
      dayOmgMoments,
      daysWithOmgMoments: Array.from(daysWithOmgMoments)
    });

  } catch (error) {
    console.error('Error syncing Tamagotchi days:', error);
    res.status(500).json({ message: 'Error syncing Tamagotchi days' });
  }
});