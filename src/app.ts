import express from 'express';
import { _getGoogleSheetClient, _getRangeSheet, _readGoogleSheet, _writeGoogleSheet } from './GoogleService';

const cors = require('cors');
const bodyParser = require("body-parser");


const app = express();
const port = 3000;

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/guests', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200')
    const sheetId = '1ETMLEErMKT3-cHXaRAzRRzGJcL_vK0j7u6OmTPqVXho'
    const tabName = 'lista_invitados'
    const range = 'A:F'
    const clientGoogle = await _getGoogleSheetClient()
    const data = await _readGoogleSheet(clientGoogle, sheetId, tabName, range);
    res.send(data);
});

app.get('/guest/:id', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200')
    const sheetId = '1ETMLEErMKT3-cHXaRAzRRzGJcL_vK0j7u6OmTPqVXho'
    const tabName = 'lista_invitados'
    const range = 'A:F'
    const clientGoogle = await _getGoogleSheetClient()
    const data = await _readGoogleSheet(clientGoogle, sheetId, tabName, range);
    const result = (data) ? data.filter((d:any) => d['guestId'] == req.params.id)[0] : null
    res.send(result);
});

app.post('/updateConfirmation', async (req, res) => {
    
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200')
    const sheetId = '1ETMLEErMKT3-cHXaRAzRRzGJcL_vK0j7u6OmTPqVXho'
    const tabName = 'lista_invitados'
    const range = 'A:F'
    const clientGoogle = await _getGoogleSheetClient()
    const indexValue = await _getRangeSheet(clientGoogle, sheetId, tabName, range, req.body.guestId);
    const cellToUpdate = `E${indexValue}`
    const dataToUpdate = [req.body.response]

    const updateCell = await _writeGoogleSheet(clientGoogle, sheetId, tabName, cellToUpdate, dataToUpdate);
    res.send(updateCell);
});
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});