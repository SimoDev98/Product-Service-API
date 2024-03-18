import { config } from "dotenv";
import {join, dirname} from 'path'
import { fileURLToPath } from "url";

//Read .env file
try{
    config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env')})
    console.log('[LOG] Reading .env configuration file successful')
}catch(err){
    console.log('[ERROR]: Error detected while trying to read .env configuration file.')
    console.log('Error: '+err.message)
    process.exit(1)
}