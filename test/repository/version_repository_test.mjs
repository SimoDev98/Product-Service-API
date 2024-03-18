import '../test-setup.mjs'
import test from "node:test"
import assert from "node:assert/strict"
import {connect, disconnect} from '../../src/database/mongodb-config.mjs'
import {updateVersionPrice, updateAvailableUnits} from '../../src/respository/mdb-version-respository.mjs'
import { deleteFullProduct, getFullProductById, insertFullProduct } from "../../src/respository/mdb-product-repository.mjs"

await connect()

test('[VERSION REPOSITORY Test 1] Update price', async () => {
    try{
        const version = {
            name: 'v.1',
            price: 124.99,
            availableUnits: 100,
            characteristics: {power: "50kW", batteryDuration: "12h"}
        }
        const product = {
            name: 'vacum',
            shortDescription: 'This is a short description.',
            brand: 'Electronics Inc.',
            userId: '1222458989',
            versions: [version],
            isVerified: true
        }
        const id = await insertFullProduct(product)
        const versionId = (await getFullProductById(id)).versions[0]._id.toString()
        //Update price
        const newPrice = 129.99
        await updateVersionPrice(versionId, newPrice)
        const versionUpdated = (await getFullProductById(id)).versions[0]
        assert.equal(versionUpdated.price, newPrice)
        await deleteFullProduct(id)
    }catch(err){
        assert.fail("Unexpected error: "+err)
    }
})

test('[VERSION REPOSITORY Test 2] Update available units', async () => {
    try{
        const version = {
            name: 'v.1',
            price: 124.99,
            availableUnits: 100,
            characteristics: {power: "50kW", batteryDuration: "12h"}
        }
        const product = {
            name: 'vacum',
            shortDescription: 'This is a short description.',
            brand: 'Electronics Inc.',
            userId: '1222458989',
            versions: [version],
            isVerified: true
        }
        const id = await insertFullProduct(product)
        const versionId = (await getFullProductById(id)).versions[0]._id.toString()
        //Update price
        const newAvailableUnits = 129.99
        await updateAvailableUnits(versionId, newAvailableUnits)
        const versionUpdated = (await getFullProductById(id)).versions[0]
        assert.equal(versionUpdated.availableUnits, newAvailableUnits)
        await deleteFullProduct(id)
    }catch(err){
        assert.fail("Unexpected error: "+err)
    }finally{
        await disconnect()
    }
})