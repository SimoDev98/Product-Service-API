import express from 'express'
import { createServer } from 'https'
import {join, dirname} from 'path'
import { fileURLToPath } from "url";
import {DisableServerError, EnableServerError} from '../../src/errors/server_errors.mjs'
import { readFileSync } from 'fs';
import { X509Certificate } from 'node:crypto'
import { GET_ENDPOINTS } from './get-endpoints.mjs'
import { UPDATE_ENDPOINTS } from './update-endpoints.mjs';
import { INSERT_ENDPOINTS } from './insert-endpoints.mjs';
import { CTErrInternalServerError } from '../errors/controller_errors.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url))
const SERVER_PORT = process.env.SERVER_PORT
const SERVER_ADDRESS = process.env.SERVER_ADDRESS
const KEY_PATH = join(__dirname, 'certificate', process.env.KEY_FILE_NAME)
const CERTIFICATE_PATH = join(__dirname, 'certificate', process.env.CERTIFICATE_FILE_NAME)
const CA_CERTIFICATE_PATH = join(__dirname, 'certificate', process.env.CA_CERTIFICATE_FILE_NAME)
const CA_CERTIFICATE_BUFFER = readFileSync(CA_CERTIFICATE_PATH)
const CA_X509_CERTIFICATE = new X509Certificate(CA_CERTIFICATE_BUFFER)

let isListening = false
export const app = express()

app.use(INSERT_ENDPOINTS)
app.use(GET_ENDPOINTS)
app.use(UPDATE_ENDPOINTS)

app.use((err, req, res, next) => {
    res.status(500).send('[MESSAGE FOR CLIENT] Error on server');
});

const sslServer = createServer({
    key: readFileSync(KEY_PATH),
    cert: readFileSync(CERTIFICATE_PATH),
    requestCert: true,
    rejectUnauthorized: true,
    ca: CA_CERTIFICATE_BUFFER
}, app)

export function enableServer(){
    if(!isListening){
        try{
            sslServer.listen(SERVER_PORT, SERVER_ADDRESS, () => {})
            console.log(`[LOG] Server listening on ${SERVER_ADDRESS}:${SERVER_PORT}`)
            isListening = true
            sslServer.on('secureConnection', (tlsSocket) => {
                const cert = tlsSocket.getX509Certificate()
                if (!cert.checkIssued(CA_X509_CERTIFICATE)) {
                    tlsSocket.end();
                    return;
                }
            })
        }catch(err){
            throw new EnableServerError('Error: ' + err)
        }
    }else{
        throw new EnableServerError('Error: Server is already listening')
    }
}

export function serverIsListening() {
    return isListening
}

export function disableServer(){
    if(isListening){
        try{
            sslServer.closeAllConnections()
            sslServer.close()
            isListening = false
            sslServer.unref()
        }catch(err){
            throw new DisableServerError('Error: ' + err)
        }
    }else{
        throw new DisableServerError('Error: Server is not listening')
    }
}

export function sendError(res, err){
    switch(err.constructor.name){
        case 'CTErrNotAvailable':
            res.status(404).send(err.message)
            break;
        case 'CTErrInternalServerError':
            res.status(500).send(err.message)
            break;
        case 'CTErrBadRequest':
            res.status(400).send(err.message)
            break;
        case 'CTErrNotAuthorized':
            res.status(401).send(err.message)
        case 'CTErrWrongFilesFormat':
            res.status(400).send(err.message)
        case 'CTErrWrongFormatProduct':
            res.status(400).send(err.message)
        case 'CTErrInsertingProduct':
            res.status(500).send(err.message)
        default:
            res.status(500).send((new CTErrInternalServerError()).message)
            break;
    }
}