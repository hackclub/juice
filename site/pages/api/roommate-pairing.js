import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get all records from RawRoommateData including bed sharing preference
    const allRoommatesQuery = base('RawRoommateData').select({
      fields: [
        'Email Address', 
        'Full Name', 
        'Name of person you are sharing room (they must indicate you on the form for it to be a match) (FULL NAME)',
        'Gender',
        'Age',
        'we booked almost only double beds. We ran out of double twin rooms available at the hotel and we had to book a some large queen rooms.Are you comfortable splitting a large queen bed with your roommate if it comes down to that being necessary based on...'
      ]
    });
    const allRoommates = await allRoommatesQuery.all();

    // Find existing pairs to avoid duplicates
    const existingPairsQuery = base('Roommate Pairing').select({
      fields: ['Roommate A', 'Roommate B']
    });
    const existingPairs = await existingPairsQuery.all();
    
    // Track people who already have rooms
    const peopleWithRooms = new Set();
    existingPairs.forEach(pair => {
      if (pair.fields['Roommate A']) {
        const roommate = pair.fields['Roommate A'][0];
        peopleWithRooms.add(roommate);
      }
      if (pair.fields['Roommate B']) {
        const roommate = pair.fields['Roommate B'][0];
        peopleWithRooms.add(roommate);
      }
    });

    // Filter out people who already have rooms
    const availableRoommates = allRoommates.filter(roommate => !peopleWithRooms.has(roommate.id));

    // Create a map of name to record for easy lookup (only for available roommates)
    const roommatesByName = new Map();
    availableRoommates.forEach(roommate => {
      const normalizedName = roommate.fields['Full Name'].toLowerCase().trim();
      roommatesByName.set(normalizedName, roommate);
    });

    // Helper function to normalize names for comparison
    function normalizeName(name) {
      if (!name) return '';
      return name.toLowerCase().trim();
    }

    // Helper function to check if two names match (allowing for variations)
    function namesMatch(name1, name2) {
      if (!name1 || !name2) return false;
      const n1 = normalizeName(name1);
      const n2 = normalizeName(name2);
      
      // Exact match
      if (n1 === n2) return true;
      
      // Handle common variations
      const variations1 = [
        n1,
        n1.replace(/\s+/g, ' '), // Remove extra spaces
        n1.split(' ').filter(n => n.length > 1).join(' '), // Remove single letters
        n1.split(' ').map(n => n[0]).join('') // Initials
      ];
      
      const variations2 = [
        n2,
        n2.replace(/\s+/g, ' '),
        n2.split(' ').filter(n => n.length > 1).join(' '),
        n2.split(' ').map(n => n[0]).join('')
      ];
      
      return variations1.some(v1 => variations2.some(v2 => v1 === v2));
    }

    // Find mutual preferences
    const pairs = [];
    const processedIds = new Set();

    // First, handle people with specific preferences
    availableRoommates.forEach(roommateA => {
      if (processedIds.has(roommateA.id)) return;

      const preferredName = roommateA.fields['Name of person you are sharing room (they must indicate you on the form for it to be a match) (FULL NAME)'];
      if (!preferredName) return;

      // Handle multiple preferences
      const preferences = preferredName.split(/[,/]/).map(p => p.trim()).filter(p => p);
      
      for (const pref of preferences) {
        // Skip invalid preferences
        if (pref.length > 100 || /[<>{}]/.test(pref)) continue;

        // Find matching roommate
        const roommateB = Array.from(roommatesByName.values()).find(r => 
          namesMatch(r.fields['Full Name'], pref)
        );

        if (!roommateB || processedIds.has(roommateB.id)) continue;

        // Check if B also preferred A
        const bPreferredName = roommateB.fields['Name of person you are sharing room (they must indicate you on the form for it to be a match) (FULL NAME)'];
        if (!bPreferredName) continue;

        const bPreferences = bPreferredName.split(/[,/]/).map(p => p.trim()).filter(p => p);
        
        // Check if B has A in their preferences
        const isMutualMatch = bPreferences.some(bPref => 
          namesMatch(bPref, roommateA.fields['Full Name'])
        );
        
        if (isMutualMatch) {
          pairs.push({
            roommateA: roommateA,
            roommateB: roommateB,
            isMadeByPairingAlgo: false // User-specified pair
          });
          processedIds.add(roommateA.id);
          processedIds.add(roommateB.id);
          break; // Found a match, no need to check other preferences
        }
      }
    });

    // Now handle people without preferences
    const unpairedRoommates = availableRoommates.filter(r => !processedIds.has(r.id));
    const unpairedWithoutPreferences = unpairedRoommates.filter(r => 
      !r.fields['Name of person you are sharing room (they must indicate you on the form for it to be a match) (FULL NAME)']
    );

    // Group unpaired people by gender
    const unpairedByGender = new Map();
    unpairedWithoutPreferences.forEach(roommate => {
      const gender = roommate.fields['Gender'];
      if (!unpairedByGender.has(gender)) {
        unpairedByGender.set(gender, []);
      }
      unpairedByGender.get(gender).push(roommate);
    });

    // Helper function to check if someone is comfortable with queen bed sharing
    function isComfortableWithQueenBed(roommate) {
      return roommate.fields['we booked almost only double beds. We ran out of double twin rooms available at the hotel and we had to book a some large queen rooms.Are you comfortable splitting a large queen bed with your roommate if it comes down to that being necessary based on...'] === true;
    }

    // Pair people within each gender group
    unpairedByGender.forEach((roommates, gender) => {
      // Sort roommates by queen bed sharing preference first, then age
      roommates.sort((a, b) => {
        // First sort by queen bed sharing preference
        const queenA = isComfortableWithQueenBed(a);
        const queenB = isComfortableWithQueenBed(b);
        if (queenA !== queenB) {
          return queenB - queenA; // Put comfortable people first
        }
        
        // Then sort by age
        const ageA = parseInt(a.fields['Age']) || 0;
        const ageB = parseInt(b.fields['Age']) || 0;
        return ageA - ageB;
      });

      // Try to pair people
      for (let i = 0; i < roommates.length - 1; i++) {
        if (processedIds.has(roommates[i].id)) continue;

        const age1 = parseInt(roommates[i].fields['Age']) || 0;
        const queen1 = isComfortableWithQueenBed(roommates[i]);
        
        for (let j = i + 1; j < roommates.length; j++) {
          if (processedIds.has(roommates[j].id)) continue;

          const age2 = parseInt(roommates[j].fields['Age']) || 0;
          const queen2 = isComfortableWithQueenBed(roommates[j]);
          const ageDiff = Math.abs(age1 - age2);

          // First priority: Match people who are both comfortable with queen bed sharing
          if (queen1 && queen2) {
            pairs.push({
              roommateA: roommates[i],
              roommateB: roommates[j],
              isMadeByPairingAlgo: true // Algorithm-created pair
            });
            processedIds.add(roommates[i].id);
            processedIds.add(roommates[j].id);
            break;
          }
          // Second priority: Match people who are both NOT comfortable with queen bed sharing
          else if (!queen1 && !queen2) {
            pairs.push({
              roommateA: roommates[i],
              roommateB: roommates[j],
              isMadeByPairingAlgo: true // Algorithm-created pair
            });
            processedIds.add(roommates[i].id);
            processedIds.add(roommates[j].id);
            break;
          }
          // Last priority: Try to match within 2 years of age if queen bed preferences don't match
          else if (ageDiff <= 2) {
            pairs.push({
              roommateA: roommates[i],
              roommateB: roommates[j],
              isMadeByPairingAlgo: true // Algorithm-created pair
            });
            processedIds.add(roommates[i].id);
            processedIds.add(roommates[j].id);
            break;
          }
        }
      }
    });

    // Create new records in Roommate Pairing table
    await Promise.all(
      pairs.map(async pair => {
        const fields = {
          'Roommate A': [pair.roommateA.id],
          'Roommate B': [pair.roommateB.id],
          'isMadeByPairingAlgo': pair.isMadeByPairingAlgo
        };
        return base('Roommate Pairing').create([{ fields }]);
      })
    );

    // Log remaining unpaired people
    const remainingUnpaired = availableRoommates.filter(r => !processedIds.has(r.id));
    console.log('\n=== REMAINING UNPAIRED PEOPLE ===');
    remainingUnpaired.forEach(roommate => {
      console.log(`\nName: ${roommate.fields['Full Name']}`);
      console.log(`Gender: ${roommate.fields['Gender']}`);
      console.log(`Age: ${roommate.fields['Age']}`);
      console.log(`Comfortable with queen bed: ${isComfortableWithQueenBed(roommate) ? 'Yes' : 'No'}`);
      console.log('----------------------------------------');
    });
    console.log(`Total remaining unpaired: ${remainingUnpaired.length}`);
    console.log('========================================\n');

    return res.status(200).json({
      pairs: pairs.map(pair => ({
        roommateA: {
          name: pair.roommateA.fields['Full Name'],
          email: pair.roommateA.fields['Email Address'],
          gender: pair.roommateA.fields['Gender'],
          age: pair.roommateA.fields['Age'],
          comfortableWithQueenBed: pair.roommateA.fields['Comfortable with queen bed sharing']
        },
        roommateB: {
          name: pair.roommateB.fields['Full Name'],
          email: pair.roommateB.fields['Email Address'],
          gender: pair.roommateB.fields['Gender'],
          age: pair.roommateB.fields['Age'],
          comfortableWithQueenBed: pair.roommateB.fields['Comfortable with queen bed sharing']
        },
        isMadeByPairingAlgo: pair.isMadeByPairingAlgo
      })),
      unpaired: remainingUnpaired.map(roommate => ({
        name: roommate.fields['Full Name'],
        email: roommate.fields['Email Address'],
        gender: roommate.fields['Gender'],
        age: roommate.fields['Age'],
        comfortableWithQueenBed: roommate.fields['Comfortable with queen bed sharing']
      }))
    });

  } catch (error) {
    console.error('ERROR:', error);
    return res.status(500).json({
      message: 'Error during roommate pairing',
      error: error.message
    });
  }
} 