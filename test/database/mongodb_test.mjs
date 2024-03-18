import '../test-setup.mjs'
import test from "node:test"
import assert from "node:assert/strict"
import {connect, disconnect, getCollection, transaction} from '../../src/database/mongodb-config.mjs'

/*Config instructions for these tests:
    .env config document is needed.
    .enf config document must have database connection url, database name.
    Connection must have at least one database with "users" collection empty
*/

const COLLECTION_NAME = 'users'

test('[MONGODB Test 1] Correct connection to database', async () => {
    try{
        await connect()
        await disconnect()
        assert.ok(true)
    }catch(err){
        assert.fail('Not expected any error')
    }
})

test('[MONGODB Test 2] Duplicate connection', async () => {
    try{
        await connect()
        await connect()
        assert.fail("Expected new Error")
    }catch(err){
        assert.equal(err.constructor.name, 'DBErrDuplicatedConnection')
    }finally{
        await disconnect()
    }
})

test('[MONGODB Test 3] Unconnected database', async () => {
    try{
        await disconnect()
        assert.fail("Expected new Error")
    }catch(err){
        assert.equal(err.constructor.name, 'DBErrNotConnected')
    }
    try{
        const collection = getCollection(COLLECTION_NAME)
    }catch(err){
        assert.equal(err.constructor.name, 'DBErrNotConnected')
    }
})

test('[MONGODB Test 4] Transaction', async () => {
    try{
        await connect()
        const col = getCollection(COLLECTION_NAME)
        await transaction(async (session) => {
            await col.insertOne({name: "George", age: 25, isStudent: true}, {session})
            await col.updateOne({name: "George"}, {$set: {age: 30}}, {session})
        })
        const user = await col.find({name: {$eq: "George"}}).toArray()
        assert.equal(user[0].age, 30)
        await col.deleteOne({name: "George"})
    }catch(err){
        assert.fail("Unexpected error: "+err.message)
    }finally{
        await disconnect()
    }
})