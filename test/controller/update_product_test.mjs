import '../test-setup.mjs'
import {test} from "node:test"
import assert from "node:assert/strict"
import { connect, disconnect } from "../../src/database/mongodb-config.mjs"
import { deleteFullProduct, getFullProductById, insertFullProduct } from '../../src/respository/mdb-product-repository.mjs'
import {updatePrice, updateUnits, deleteProduct, verify} from '../../src/controller/update-product.mjs'

await connect()

const correctProduct = {
    name: 'Product 1',
    shortDescription: 'Short description',
    brand: 'Brand',
    userId: '1111111',
    tags: ['tag1', 'tag2', 'tag3'],
    versions: [
        {
            name: 'v.1',
            price: 12.50,
            availableUnits: 1000,
            characteristics: {a: 'a', b: true, c: 125},
            filesNames: []
        },
        {
            name: 'v.1',
            price: 12.50,
            availableUnits: 1000,
            characteristics: {a: 'a', b: true, c: 125},
            filesNames: []
        }
    ],
    isVerified: true
}

test('[UPDATE PRODUCTS CONTROLLER Test 1] Illegal update price', async () => {
    try{
        const id = await insertFullProduct(correctProduct)
        let product = await getFullProductById(id)

        //Wrong user id.
        try{
            await updatePrice({userId: "555458", price: 98.25, versionId: product.versions[0]._id.toString()})
        }catch(err){
            assert.equal(err.constructor.name, 'CTErrNotAuthorized')
        }

        //Wrong version id.
        try{
            await updatePrice({userId: correctProduct.userId, price: 98.25, versionId: "5e8dbf0e5f82c12d6f44ab23"})
        }catch(err){
            assert.equal(err.constructor.name, 'CTErrNotAuthorized')
        }

         //Wrong version id and user id.
        try{
            await updatePrice({userId: "555458", price: 98.25, versionId: "5e8dbf0e5f82c12d6f44ab23"})
        }catch(err){
            assert.equal(err.constructor.name, 'CTErrNotAuthorized')
        }

        assert.equal(product.versions[0].price, 12.5)
        await updatePrice({userId: correctProduct.userId, price: 98.25, versionId: product.versions[0]._id.toString()})
        product = await getFullProductById(id)
        assert.equal(product.versions[0].price, 98.25)

        await deleteFullProduct(id)
    }catch(err){
        assert.fail('Unexpected error: ' + err)
    }
})

test('[UPDATE PRODUCT CONTROLLER Test 2] Illegal update available units', async () => {
    try{
        const id = await insertFullProduct(correctProduct)
        let product = await getFullProductById(id)

        //Wrong user id.
        try{
            await updateUnits({userId: "555458", availableUnits: 1001, versionId: product.versions[0]._id.toString()})
        }catch(err){
            assert.equal(err.constructor.name, 'CTErrNotAuthorized')
        }

        //Wrong version id.
        try{
            await updateUnits({userId: correctProduct.userId, availableUnits: 1001, versionId: "5e8dbf0e5f82c12d6f44ab23"})
        }catch(err){
            assert.equal(err.constructor.name, 'CTErrNotAuthorized')
        }

         //Wrong version id and user id.
        try{
            await updateUnits({userId: "555458", availableUnits: 1001, versionId: "5e8dbf0e5f82c12d6f44ab23"})
        }catch(err){
            assert.equal(err.constructor.name, 'CTErrNotAuthorized')
        }

        assert.equal(product.versions[0].availableUnits, 1000)
        await updateUnits({userId: correctProduct.userId, availableUnits: 1001, versionId: product.versions[0]._id.toString()})
        product = await getFullProductById(id)
        assert.equal(product.versions[0].availableUnits, 1001)

        await deleteFullProduct(id)
    }catch(err){
        assert.fail('Unexpected error: ' + err)
    }
})

test('[UPDATE PRODUCT CONTROLLER Test 3] Verify products', async () => {
    try{
        const wrongProduct = {...correctProduct}
        wrongProduct.isVerified = false
        const id = await insertFullProduct(wrongProduct)
        let product = await getFullProductById(id)
        assert.ok(!product.isVerified)
        await verify({productId: id})
        product = await getFullProductById(id)
        assert.ok(product.isVerified)

        try{
            await(verify({productId: "5e8dbf0e5f82c12d6f44ab23"})) //Fake product id.
        }catch(err){
            assert.equal(err.constructor.name, 'CTErrImpossibleVerifyProduct')
        }

        wrongProduct.isVerified = true
        await deleteFullProduct(id)
    }catch(err){
        assert.fail('Unexpected error: ' + err)
    }
})

test('[UPDATE PRODUCT CONTROLLER Test 4] Delete products', async () => {
    try{
        let id = await insertFullProduct(correctProduct)
        //Not admin and not owner.
        try{
            await deleteProduct({productId: id, userId: "654652"}, false) //User id different than the user id of product owner.
        }catch(err){
            assert.equal(err.constructor.name, 'CTErrNotAuthorized')
        }

        //Not owner but is admin
        await deleteProduct({productId: id, userId: "654652"}, true)
        try{
            await getFullProductById(id)
        }catch(err){
            assert.equal(err.constructor.name, 'RPErrProductNotFound')
        }

        //Not admin but is product owner.
        id = await insertFullProduct(correctProduct)
        await deleteProduct({productId: id, userId: correctProduct.userId}, false)
        try{
            await getFullProductById(id)
        }catch(err){
            assert.equal(err.constructor.name, 'RPErrProductNotFound')
        }
    }catch(err){
        assert.fail('Unexpected error: ' + err)
    }finally{
        await disconnect()
    }
})