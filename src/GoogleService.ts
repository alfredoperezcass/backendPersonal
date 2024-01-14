import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();


export async function _getGoogleSheetClient() {
  const authClient = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : ''
    },
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets', 
        'https://www.googleapis.com/auth/drive', 
        'https://www.googleapis.com/auth/drive.readonly', 
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets.readonly' 
    ],
  });
  return google.sheets({
    version: 'v4',  
    auth: authClient,
  });
}

export async function _readGoogleSheet(googleSheetClient:any, sheetId:string, tabName:string, range:string) {
    const { data } = await googleSheetClient.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${tabName}!${range}`,
    });
    const header = data.values[0] as string[];
    const result = data.values.slice(1).map((row:any) => {
    const obj = {} as any;
    header.forEach((key: string, index: number) => {
        obj[key] = row[index];
    });
    return obj;
    });

  return result;
}

export async function _writeGoogleSheet(googleSheetClient:any, sheetId:string, tabName:string, range:string, data:any) {
    console.log('range', range);
    
  await googleSheetClient.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
    valueInputOption: 'RAW',
    resource: {
      "values": [data]
    },
  })
}

export async function _getRangeSheet(googleSheetClient:any, sheetId:string, tabName:string, range:string, valueToFilter: string | null = null){
    try {

        const response = await googleSheetClient.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: `${tabName}!${range}`,
        });
    
        const values = response.data.values;
    
        if(valueToFilter){
            const rowIndex = values.findIndex((row: string | any[]) => row.includes(valueToFilter));
            return rowIndex + 1;
        }

        return null;
    } catch (error:any) {
        console.error('Error al filtrar', error.message);
      }

}