import { Template } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { text, multiVariableText, image, table } from '@pdfme/schemas';
import Airtable from 'airtable';
import fs from 'fs';
import path from 'path';

/*
 * RawRoommateData Schema from Airtable:
 * {
 *   "Email Address": string,      // The email address of the roommate
 *   "Full Name": string,         // The full name of the person
 *   // ... other fields available in the table
 * }
 */

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = new Map();

// Base template configuration
const baseTemplate = {
  basePdf: {
    width: 210,  // A4 width in mm
    height: 297, // A4 height in mm
    padding: [20, 10, 20, 10],
    staticSchema: []
  },
  schemas: [
    [
      {
        name: "field1",
        type: "multiVariableText",
        content: "{}",
        position: { x: 10, y: 20 },
        width: 189.97,
        height: 140,
        rotate: 0,
        alignment: "left",
        verticalAlignment: "top",
        fontSize: 18,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        strikethrough: false,
        underline: false,
        readOnly: true,
        variables: [],
        required: false,
        text: ""
      },
      {
        name: "qrcode",
        type: "image",
        position: { x: 8, y: 165 },
        width: 35,
        height: 35,
        rotate: 0,
        opacity: 1,
        backgroundColor: "",
        required: true
      },
      {
        name: "field1continued",
        type: "multiVariableText",
        content: "{}",
        position: { x: 10, y: 210 },
        width: 150,
        height: 40,
        rotate: 0,
        alignment: "left",
        verticalAlignment: "top",
        fontSize: 16,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        strikethrough: false,
        underline: false,
        readOnly: true,
        variables: [],
        required: false,
        text: ""
      }
    ],
    [
      {
        name: "field2",
        type: "multiVariableText",
        content: "{}",
        position: { x: 10, y: 20 },
        width: 189.97,
        height: 255.59,
        rotate: 0,
        alignment: "left",
        verticalAlignment: "top",
        fontSize: 18,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        strikethrough: false,
        underline: false,
        readOnly: true,
        variables: [],
        required: false,
        text: ""
      }
    ]
  ],
  pdfmeVersion: "5.3.13"
};

// Function to get data from cache or fetch from Airtable
async function getRoommateData(email) {
  console.log('2.1. Checking cache for email:', email);
  
  const now = Date.now();
  const cacheKey = `roommate-${email}`;
  const cachedData = cache.get(cacheKey);

  // Check if we have valid cached data
  if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
    console.log('2.2. Cache hit! Returning cached data');
    return cachedData.data;
  }

  console.log('2.3. Cache miss or expired, fetching from Airtable');
  try {
    console.log('2.4. Creating select query');
    const query = base('RawRoommateData').select({
      filterByFormula: `{Email Address} = '${email}'`,
    });
    
    console.log('2.5. Executing Airtable query');
    const records = await query.all();
    
    console.log('2.6. Query complete, found records:', records.length);
    
    if (records.length === 0) {
      console.log('2.7. No records found');
      cache.set(cacheKey, { data: null, timestamp: now });
      return null;
    }
    
    console.log('2.8. Processing first record');
    const result = {
      ...records[0].fields,
      id: records[0].id
    };

    // Check both Roommate Pairing and Roommate Pairing 2 fields
    const roommateId = records[0].fields['Roommate Pairing 2'] && records[0].fields['Roommate Pairing 2'].length > 0 
      ? records[0].fields['Roommate Pairing 2'][0]  // For Roommate B
      : (records[0].fields['Roommate Pairing'] && records[0].fields['Roommate Pairing'].length > 0 
        ? records[0].fields['Roommate Pairing'][0]  // For Roommate A
        : null);

    console.log('Checking for roommate ID:', roommateId);
    
    if (roommateId) {
      try {
        // First check if we're Roommate A or B in any pairing
        const pairingQuery = base('Roommate Pairing').select({
          filterByFormula: `OR(RECORD_ID() = '${roommateId}', {Roommate A} = '${records[0].id}', {Roommate B} = '${records[0].id}')`
        });
        const pairings = await pairingQuery.all();
        console.log('Found pairings:', pairings.length);
        
        if (pairings.length > 0) {
          const pairing = pairings[0];
          result.hotelSelection = pairing.fields['Hotel Selection For Second Half'];
          console.log('Found hotel selection:', result.hotelSelection);

          // Get the other roommate's ID based on whether we're A or B
          const isRoommateA = pairing.fields['Roommate A'] && pairing.fields['Roommate A'][0] === records[0].id;
          const otherRoommateId = isRoommateA ? 
            (pairing.fields['Roommate B'] ? pairing.fields['Roommate B'][0] : null) : 
            (pairing.fields['Roommate A'] ? pairing.fields['Roommate A'][0] : null);

          console.log('Is Roommate A:', isRoommateA);
          console.log('Other Roommate ID:', otherRoommateId);
          
          if (otherRoommateId) {
            // Get the other roommate's details
            const otherRoommateQuery = base('RawRoommateData').select({
              filterByFormula: `RECORD_ID() = '${otherRoommateId}'`
            });
            const otherRoommateRecords = await otherRoommateQuery.all();
            
            if (otherRoommateRecords.length > 0) {
              console.log('Found other roommate in RawRoommateData:', otherRoommateRecords[0].fields['Full Name']);
              result.roommate = otherRoommateRecords[0].fields;
            }
          }
        } else {
          // If no pairing found, try to get roommate by name
          const roommateName = records[0].fields['Name of person you are sharing room (they must indicate you on the form for it to be a match) (FULL NAME)'];
          console.log('No pairing found, trying by roommate name:', roommateName);
          
          if (roommateName) {
            const roommateQuery = base('RawRoommateData').select({
              filterByFormula: `{Full Name} = '${roommateName}'`
            });
            const roommateRecords = await roommateQuery.all();
            
            if (roommateRecords.length > 0) {
              console.log('Found roommate by name:', roommateRecords[0].fields['Full Name']);
              result.roommate = roommateRecords[0].fields;
              
              // Now try to get the hotel selection from their pairing
              const otherPairingQuery = base('Roommate Pairing').select({
                filterByFormula: `OR({Roommate A} = '${roommateRecords[0].id}', {Roommate B} = '${roommateRecords[0].id}')`
              });
              const otherPairings = await otherPairingQuery.all();
              
              if (otherPairings.length > 0) {
                result.hotelSelection = otherPairings[0].fields['Hotel Selection For Second Half'];
                console.log('Found hotel selection from roommate pairing:', result.hotelSelection);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching roommate data:', error);
      }
    } else {
      // Fallback to checking Roommate Pairing table
      const pairingQuery = base('Roommate Pairing').select({
        filterByFormula: `OR({Roommate A} = '${records[0].id}', {Roommate B} = '${records[0].id}')`
      });
      const pairings = await pairingQuery.all();
      console.log('Fallback pairing check - Pairings found:', pairings.length);

      if (pairings.length > 0) {
        const pairing = pairings[0];
        result.hotelSelection = pairing.fields['Hotel Selection For Second Half'];
        console.log('Found hotel selection:', result.hotelSelection);
        
        const isRoommateA = pairing.fields['Roommate A'][0] === records[0].id;
        const roommateId = isRoommateA ? pairing.fields['Roommate B'][0] : pairing.fields['Roommate A'][0];

        // Get roommate details
        const roommateQuery = base('RawRoommateData').select({
          filterByFormula: `RECORD_ID() = '${roommateId}'`
        });
        const roommateRecords = await roommateQuery.all();

        if (roommateRecords.length > 0) {
          result.roommate = roommateRecords[0].fields;
          result.isMadeByPairingAlgo = pairing.fields['isMadeByPairingAlgo'] || false;
        }
      }
    }

    // Store in cache
    cache.set(cacheKey, {
      data: result,
      timestamp: now
    });

    console.log('2.11. Data cached and returning result');
    console.log('Final result with roommate:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('2.X. Airtable Error:', error);
    throw error;
  }
}

// Cache cleanup function
function cleanupCache() {
  console.log('Running cache cleanup');
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

// Run cache cleanup every 5 minutes
setInterval(cleanupCache, CACHE_TTL);

export default async function handler(req, res) {
  return res.status(403).json({ message: 'This endpoint has been closed for security.' });
} 