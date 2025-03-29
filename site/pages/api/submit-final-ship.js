import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      codeUrl,
      playableUrl,
      videoURL,
      firstName,
      lastName,
      email,
      screenshot,
      description,
      githubUsername,
      addressLine1,
      addressLine2,
      city,
      stateProvince,
      country,
      zipPostalCode,
      birthday,
      hoursSpent,
      hoursSpentJustification,
      "How did you hear about this?": howDidYouHear,
      "What are we doing well?": whatAreWeDoingWell,
      "How can we improve?": howCanWeImprove
    } = req.body;

    // Validate required fields
    const requiredFields = {
      // Page 1 - Game Submission
      'Code URL': { value: codeUrl, page: 1 },
      'Playable URL': { value: playableUrl, page: 1 },
      'Description': { value: description, page: 1 },
      
      // Page 2 - Personal Info
      'First Name': { value: firstName, page: 2 },
      'Last Name': { value: lastName, page: 2 },
      'Email': { value: email, page: 2 },
      'GitHub Username': { value: githubUsername, page: 2 },
      'Birthday': { value: birthday, page: 2 },
      
      // Page 3 - Shipping Address
      'Address Line 1': { value: addressLine1, page: 3 },
      'City': { value: city, page: 3 },
      'Country': { value: country, page: 3 },
      'ZIP/Postal Code': { value: zipPostalCode, page: 3 }
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, field]) => !field.value)
      .map(([name, field]) => ({
        name,
        page: field.page
      }));

    if (missingFields.length > 0) {
      // Group missing fields by page
      const groupedByPage = missingFields.reduce((acc, field) => {
        if (!acc[field.page]) {
          acc[field.page] = [];
        }
        acc[field.page].push(field.name);
        return acc;
      }, {});

      return res.status(400).json({ 
        success: false,
        message: 'Required fields are missing',
        missingFields: groupedByPage
      });
    }

    // Create new record in YSWS Project Submission table
    const record = await base('YSWS Project Submission').create([
      {
        fields: {
          'Code URL': codeUrl,
          'Playable URL': playableUrl,
          'videoURL': videoURL,
          'First Name': firstName,
          'Last Name': lastName,
          'Email': email,
          'Screenshot': screenshot ? [{
            url: screenshot
          }] : undefined,
          'Description': description,
          'GitHub Username': githubUsername,
          'Address (Line 1)': addressLine1,
          'Address (Line 2)': addressLine2,
          'City': city,
          'State / Province': stateProvince,
          'Country': country,
          'ZIP / Postal Code': zipPostalCode,
          'Birthday': birthday,
          'Optional - Override Hours Spent': hoursSpent,
          'Optional - Override Hours Spent Justification': hoursSpentJustification,
          'How did you hear about this?': howDidYouHear,
          'What are we doing well?': whatAreWeDoingWell,
          'How can we improve?': howCanWeImprove
        }
      }
    ]);

    return res.status(200).json({ 
      success: true,
      message: "Project submitted successfully!",
      record: record[0]
    });

  } catch (error) {
    console.error('YSWS submission error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error processing submission',
      error: error.error || 'UNKNOWN_ERROR'
    });
  }
} 