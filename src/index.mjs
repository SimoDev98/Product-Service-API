import './config-setup.mjs'
import {connect, disconnect} from './database/mongodb-config.mjs'
import {enableServer, disableServer, serverIsListening} from './server/server-config.mjs'

//Connect database
try{
    await connect()
    console.log('[LOG] Connection to database successful')
}catch(err){
    console.log('[ERROR] Error detected while trying to connect to database.')
    console.error('Error: '+err.message)
    process.exit(1)
}

//Start up server
try{
    enableServer()
    if(serverIsListening()){
        console.log('[LOG] Server has started up successfully.')
    }
}catch(err){
    console.log('[ERROR] Error detected while trying to start up server.')
    console.error('Error: '+err.message)
    process.exit(1)
}

console.log('[INFO] Press enter key to terminate the program.')

//Add listener to shutdown
process.stdin.on('data',async (data) => {
    try{
        console.log('[SHUTDOWN PROCESS - LOG] Shutdown order.')
        disableServer()
        console.log('[SHUTDOWN PROCESS - LOG] Server has been disabled.')
        await disconnect()
        console.log('[SHUTDOWN PROCESS - LOG] Disconnected from database.')
        console.log('[SHUTDOWN PROCESS - LOG] End of the process.')
        process.exit(0)
    }catch(err){
        console.error('[SHUDOWN PROCESS - ERROR] Error detected during the shutdown process.')
        console.error('Error: '+err.message)
        process.exit(1)
    }
})