import { MongoClient } from "mongodb"
import { DBErrConnection, DBErrDuplicatedConnection, DBErrNotConnected, DBErrInvalidCollectionName, DBErrTransactionFailed , DBErrInvalidJoinedCollectionArguments} from "../errors/db_errors.mjs"
let db = null, client = null;

const DB_CONNECTION_URL = process.env.MONGO_CONNECTION_URL
const DB_NAME = process.env.MONGO_DB_NAME


export async function connect() {
    if (db == null) {
        try {
            client = new MongoClient(DB_CONNECTION_URL)
            await client.connect()
            let dbList = (await client.db().admin().listDatabases()).databases
            if (dbList.find(obj => { return obj.name == DB_NAME }) != undefined) {
                db = client.db(DB_NAME)
            } else {
                throw new Error('Database does not exist')
            }
        } catch (err) {
            throw new DBErrConnection(err.message)
            db = null
            client = null
        }
    } else {
        throw new DBErrDuplicatedConnection()
    }
}

export async function disconnect() {
    if (db != null && client != null) {
        await client.close()
        db = null
        client = null
    } else {
        throw new DBErrNotConnected()
    }
}

export function getCollection(collectionName) {
    if (db != null && client != null) {
        try {
            return db.collection(collectionName)
        } catch (err) {
            throw new DBErrInvalidCollectionName(err)
        }
    } else {
        throw new DBErrNotConnected()
    }
}

export function transaction(callback){
    return new Promise((resolve, reject) => {
        if(db != null && client != null){
            const session = client.startSession()
            const transactionOptions = {
                readPreference: 'primary',
                readConcern: { level: 'local' },
                writeConcern: { w: 'majority' }
            };
            session.withTransaction(async () => {
                await callback(session)
            }, transactionOptions)
            .then(result => resolve(result))
            .catch(err => reject(new DBErrTransactionFailed(err)))
            .finally(async () => {await session.endSession()})
        }else{
            reject(new DBErrNotConnected())
        }
    })
}

export function getJoinedCollection(aggregations, collectionName){
    return new Promise((resolve, reject) => {
        if (db != null && client != null) {
            try {
                resolve(db.collection(collectionName).aggregate(aggregations))
            } catch (err) {
                reject(new DBErrInvalidJoinedCollectionArguments(err))
            }
        } else {
            reject(new DBErrNotConnected())
        }
    })
}
