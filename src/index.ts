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

const spreadsheets = await googleSheets.spreadsheets.get({
  auth,
  spreadsheetId: <string>process.env.SPREADSHEET_ID,
});

const worksheetIdentifier = (<sheets_v4.Schema$Sheet[]>(
  spreadsheets.data.sheets
)).map((val) => {
  const { properties: prop } = <
    { properties: sheets_v4.Schema$SheetProperties }
  >val;

  return {
    index: prop.index,
    title: prop.title,
  };
});

const rawData = await googleSheets.spreadsheets.values.get({
  auth,
  spreadsheetId: <string>process.env.SPREADSHEET_ID,
  range: `${worksheetIdentifier[0].title}!A1:Z1000`,
});

const rawDataClassification = (<string[][]>rawData.data.values)
  .map((val, i, self) => {
    if (i >= 1) {
      const header = self[0];

      return val.reduce(
        (obj, _, j) => ({ ...obj, [header[j]]: self[i][j] }),
        {}
      );
    }
    return null;
  })
  .slice(1);
