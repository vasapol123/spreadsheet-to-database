import { google, sheets_v4 } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const googleSheets = google.sheets({
  version: 'v4',
  auth: await auth.getClient(),
});

const worksheets = await googleSheets.spreadsheets.get({
  auth,
  spreadsheetId: <string>process.env.SPREADSHEET_ID,
});

const worksheetIdentifier = (<sheets_v4.Schema$Sheet[]>(
  worksheets.data.sheets
)).map((val) => {
  const { properties: prop } = <
    { properties: sheets_v4.Schema$SheetProperties }
  >val;

  return {
    index: prop.index,
    title: prop.title,
  };
});
