import '../test-setup.mjs'
import test from "node:test"
import assert from "node:assert/strict"
import {enableServer, disableServer, serverIsListening, app} from '../../src/server/server-config.mjs'
import { request } from 'node:https'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {connect} from '../../src/database/mongodb-config.mjs'


await connect()
test('[SERVER CONFIG Test 1] Enable & Disable server', () => {
    try{
        enableServer()
        assert.ok(serverIsListening())
        enableServer()
        assert.fail('Expected new Error')
    }catch(err){
        assert.equal(err.constructor.name, 'EnableServerError')
    }
    try{
        disableServer()
        assert.ok(!serverIsListening())
    }catch(err){
        assert.fail('Unexpected Error: '+err)
    }
    try{
        disableServer()
        assert.fail('Expected new Error')
    }catch(err){
        assert.equal(err.constructor.name, 'DisableServerError')
    }
})

test('[SERVER CONFIG Test 2] Check client valid certificate', () => {
    try{
        const responses = new Set()
        app.get('/', (req, res) => {
            responses.add(req)
            res.send('OK')
        })
        enableServer()
        
        //Create client connection
        const CA_CERTIFICATE = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'certificate', process.env.CA_CERTIFICATE_FILE_NAME))

        const VALID_CLIENT_CERTIFICATE = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'certificate', 'VALID_CLIENT_CERTIFICATE.pem'))
        const VALID_CLIENT_KEY = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'certificate', 'VALID_CLIENT_KEY.pem'))
        const options = {
            hostname: process.env.SERVER_ADDRESS,
            port: process.env.SERVER_PORT,
            method: 'GET',
            ca: [CA_CERTIFICATE],
            key: VALID_CLIENT_KEY,
            cert: VALID_CLIENT_CERTIFICATE
        }
        
        const req = request(options, (res) => {
            assert.ok(res.socket.authorized)
            assert.ok(res.statusCode == 200)
        })

        req.on('error', (err) => {
            throw err
        })

        req.on('close', () => {
            assert.ok(responses.size == 1)
        })

        req.end();
    }catch(err){
        assert.fail('Unexpected error. Error: '+err)
    }finally{
        disableServer()
    }

})