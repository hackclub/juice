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

    // Get roommate information if we have a Roommate Pairing 2 ID
    if (records[0].fields['Roommate Pairing 2'] && records[0].fields['Roommate Pairing 2'].length > 0) {
      const roommateId = records[0].fields['Roommate Pairing 2'][0];
      console.log('Found roommate ID in Roommate Pairing 2:', roommateId);

      try {
        // Get the roommate's name from the record
        const roommateName = records[0].fields['Name of person you are sharing room (they must indicate you on the form for it to be a match) (FULL NAME)'];
        console.log('Found roommate name:', roommateName);
        
        if (roommateName) {
          // Fetch the roommate's complete data from RawRoommateData using their name
          const roommateQuery = base('RawRoommateData').select({
            filterByFormula: `{Full Name} = '${roommateName}'`
          });
          const roommateRecords = await roommateQuery.all();
          
          if (roommateRecords.length > 0) {
            console.log('Found roommate record in RawRoommateData:', JSON.stringify(roommateRecords[0].fields, null, 2));
            result.roommate = roommateRecords[0].fields;
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
  console.log('1. Starting request handler');
  const { email } = req.query;
  
  if (!email) {
    console.log('1.1. No email provided');
    return res.status(400).json({ message: 'Email parameter is required' });
  }
  console.log('1.2. Email parameter received:', email);
  
  try {
    console.log('2.0. Initiating roommate data fetch');
    const roommateData = await getRoommateData(email);

    if (!roommateData) {
      console.log('3.0. No roommate data found');
      return res.status(404).json({ message: 'No roommate found with this email' });
    }

    const fullName = roommateData['Full Name'] || 'there';
    console.log('3.1. Found roommate:', fullName);

    // Load the QR codes
    const qrCodePath = path.join(process.cwd(), 'public', 'GroupWeChat.png');
    const whatsappQrPath = path.join(process.cwd(), 'public', 'WhatsApp.jpg');
    console.log('4.1. Loading QR codes from:', qrCodePath, whatsappQrPath);
    
    const qrCodeImage = fs.readFileSync(qrCodePath);
    const whatsappQrImage = fs.readFileSync(whatsappQrPath);
    
    const qrCodeBase64 = `data:image/png;base64,${qrCodeImage.toString('base64')}`;
    const whatsappQrBase64 = `data:image/jpeg;base64,${whatsappQrImage.toString('base64')}`;
    console.log('4.2. QR codes loaded and converted to base64');

    // Split the template text into before and after QR code
    const templateTextBefore = `China Guide for when you land

Hey ${fullName}, Thomas here. Here is the relevant information for your travel.

Make sure to have a printed copy of your invitation letter from AdventureX with you while you travel in case you are asked any questions from the customs. The easiest way to explain the event if asked is that it's an academic exchange for teenagers learning how to code. If they ask for futher information you can specify video game creation Game Jam. 

If you need to contact me please send me a message on WeChat. My WeChat id is: Thomas-Stubblefield

You can also contact me via my phone number on WhatsApp, text message, or call: +1 (864) 384-3747 (please only contact me via my phone number for travel coordination or emergency situations).

When you land, please send a message in the Travel Transportation WeChat group (scan QR code below) and there will be a staff member to help you travel to the venue/hotel.`;

    const templateTextAfter = `Roommate: ${
      roommateData.roommate ? 
      `${roommateData.roommate['Full Name'] || 'TBD'}
Email: ${roommateData.roommate['Email Address'] || 'TBD'}
Gender: ${roommateData.roommate['Gender'] || 'TBD'}
Age: ${roommateData.roommate['Age'] || 'TBD'}
Phone: ${roommateData.roommate['Your Phone Number'] || 'TBD'}
WeChat: ${roommateData.roommate['WeChat Contact (put - if you do not have one yet or INDIA if you\'re in India)'] || '-'}
Flight: ${roommateData.roommate['Your Airline'] || ''} ${roommateData.roommate['Your flight number (flight that lands in Shanghai)'] || ''}
Arrival: ${roommateData.roommate['Date your flight lands'] || ''} ${roommateData.roommate['Time your flight lands'] || ''}
Game: ${roommateData.roommate['Name of the game you\'re making'] || 'TBD'}
Food: ${roommateData.roommate['Please list out your dietary preferences / requirements / allergies'] || 'TBD'}
Country: ${roommateData.roommate['Country you\'re from'] || 'TBD'}
Bio: ${roommateData.roommate['Short catch phrase that embodies your vibe (for others to see)'] || 'TBD'}`
      : 'TBD'
    }`;

    const secondPageText = `The Hotel for your stay from April 4 - 8 is Yitel Premium. This is the address of Yitel Premium: 

Address: Building 1, No. 1119 Yan'an West Road, Changning District, Shanghai, China

Phone Number: +86-21-55698889

Room: under reservation of Thomas Stubblefield (double twin)

The Hotel you are staying in for April 8 - 11 is Yiju Hotel (Shanghai Caohejing Development Zone Subway Station Branch)

Address: No.3 Building, 2007 Hongmei Road (Hongmei Lu), Xuhui District, Shanghai, 201103, China

Phone Number: +86-18917738737

Room: under reservation of Thomas Stubblefield (double twin)

You will have the same roommate for your time at this hotel as listed on the previous page. Please below have your parents sign and provide phone number giving you permission to check yourself into the Hotel during your academic exchange in China

_____________________  ____________________________________
(parent signature)                  (parent phone number)

(we will present this to the hotel if they require it. Please do this even if you're 18)

For your phone to work in China please talk to your wireless provider and ask them to enable an international plan for while you're traveling abroad. If you enable data roaming when you land, it should work automatically similarly to how it works in your home country. Alternatively you can look into SIM and eSIM providers. 

For payments use AliPay, for communications use WeChat (if applicable), for Transportation we will use Didi (inside WeChat), for maps use AMap. 
`;

    // Before creating the table schema, log the data we're using
    console.log('Data being used for table:', JSON.stringify({
      roommateData: roommateData,
      hasRoommate: !!roommateData.roommate,
      roommateFields: roommateData.roommate || 'No roommate data'
    }, null, 2));

    const template = {
      ...baseTemplate,
      schemas: [
        [
          {
            ...baseTemplate.schemas[0][0],
            text: templateTextBefore
          },
          {
            ...baseTemplate.schemas[0][1],
            required: true
          },
          {
            name: "whatsapp",
            type: "image",
            position: { x: 48, y: 165 },
            width: 35,
            height: 35,
            rotate: 0,
            opacity: 1,
            backgroundColor: "",
            required: true
          },
          {
            ...baseTemplate.schemas[0][2],
            text: templateTextAfter,
            height: 40  // Increased height to accommodate the text
          }
        ],
        [
          {
            ...baseTemplate.schemas[1][0],
            text: secondPageText
          }
        ]
      ]
    };

    console.log('5.1. QR code schemas:', JSON.stringify([template.schemas[0][1], template.schemas[0][2]], null, 2));
    console.log('5.2. Starting PDF generation');
    
    const pdf = await generate({
      template,
      inputs: [{
        qrcode: qrCodeBase64,
        whatsapp: whatsappQrBase64
      }],
      plugins: { text, multiVariableText, image }
    });
    console.log('6. PDF generation complete');

    console.log('7. Setting response headers');
    const isView = req.query.view === 'true';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `${isView ? 'inline' : 'attachment'}; filename=china-guide.pdf`
    );

    console.log('8. Sending PDF response');
    res.send(Buffer.from(pdf.buffer));
    console.log('9. Response sent successfully');
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ 
      message: 'Error generating PDF', 
      error: error.message,
      state: {
        errorLocation: error.stack
      }
    });
  }
} 