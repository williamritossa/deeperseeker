import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  
  try {
    const { name, email, researchPrompt } = req.body;
    const safeName = name ? name : "Missing";
    const safeEmail = email ? email : "Missing";
    const safeResearchPrompt = researchPrompt ? researchPrompt : "Missing";
    
    // Replace newline characters with literal "\n"
    const formattedResearchPrompt = safeResearchPrompt.replace(/\n/g, "\\n");

    console.log('Received data:', { name: safeName, email: safeEmail, researchPrompt: formattedResearchPrompt });

    // Set up Google auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const authClient = await auth.getClient();
    console.log('Auth client created successfully.');
    
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    console.log('Using spreadsheet ID:', spreadsheetId);

    // Build payload: Name in column A, Email in column B, Research Prompt in column C, default "Received" in column D.
    const payload = {
      values: [[safeName, safeEmail, formattedResearchPrompt, "Received"]],
    };
    
    console.log('Append payload:', {
      spreadsheetId,
      range: 'Sheet1!A:D',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: payload,
    });
    
    // Append the new row
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:D',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: payload,
    });
    
    console.log('Append response:', response.data);
    res.status(200).json({ message: 'Row appended successfully', data: response.data });
  } catch (error) {
    console.error('Error appending to sheet:', error);
    res.status(500).json({ error: error.message });
  }
}