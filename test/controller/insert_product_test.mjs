import '../test-setup.mjs'
import test from "node:test"
import assert from "node:assert/strict"
import { connect, disconnect } from "../../src/database/mongodb-config.mjs"
import { newProduct } from '../../src/controller/insert-product.mjs'
import { deleteFullProduct, getFullProductsBySearch } from '../../src/respository/mdb-product-repository.mjs'

//For this test it's mandatory to have pictures in product-service/src/tmp_files and
//a product-service/src/files_storage

await connect()

const correctProduct = {
    name: 'Product 1',
    shortDescription: 'Short description',
    brand: 'Brand',
    userId: '999875452',
    tags: ['tag1', 'tag2', 'tag3'],
    versions: [
        {
            name: 'v.1',
            price: 12.50,
            availableUnits: 1000,
            characteristics: {a: 'a', b: true, c: 125},
            filesNames: [],
            currency: 'USD'
        },
        {
            name: 'v.1',
            price: 12.50,
            availableUnits: 1000,
            characteristics: {a: 'a', b: true, c: 125},
            filesNames: [],
            currency: 'EUR'
        }
    ]
}

test('[CONTROLLER INSERT PRODUCT Test 1] Wrong product format.', async () => {
    const filesNames = ['aaaaaversion-1.jpg', 'aaaaaversion-1.jpg', 'aaaaaversion-1.jpg']
    const wrongProduct = {...correctProduct}
    delete wrongProduct.name //Product without mandatory field product
    try{
        await newProduct(wrongProduct, filesNames)
        assert.fail("Expected new Error")
    }catch(err){
        assert.equal(err.constructor.name, 'CTErrWrongFormatProduct')
    }
})

test('[CONTROLLER INSERT PRODUCT Test 2] Wrong product format (have no versions)', async () => {
    const filesNames = ['aaaaaversion-1.jpg', 'aaaaaversion-1.jpg', 'aaaaaversion-1.jpg']
    const wrongProduct = {...correctProduct}
    delete wrongProduct.versions //Product without mandatory field product
    try{
        await newProduct(wrongProduct, filesNames)
        assert.fail("Expected new Error")
    }catch(err){
        assert.equal(err.constructor.name, 'CTErrWrongFormatProduct')
    }
})

test('[CONTROLLER INSERT PRODUCT Test 3] Wrong filesNames empty', async () => {
    let filesNames = []
    const product = {...correctProduct}
    try{
        await newProduct(product, filesNames)
        assert.fail("Expected new Error")
    }catch(err){
        assert.equal(err.constructor.name, 'CTErrWrongFilesFormat')
    }

    filesNames = undefined
    try{
        await newProduct(product, filesNames)
        assert.fail("Expected new Error")
    }catch(err){
        assert.equal(err.constructor.name, 'CTErrWrongFilesFormat')
    }
})

test('[CONTROLLER INSERT PRODUCT Test 4] Wrong files name format', async () => {
    const filesNames = ['aaaaaversion-1sadf.jpg', 'aaaaaversion1asd.jpg', 'aaaaavsion-1.jpg']
    const product = {...correctProduct}
    try{
        await newProduct(product, filesNames)
        assert.fail("Expected new Error")
    }catch(err){
        assert.equal(err.constructor.name, 'CTErrWrongFilesFormat')
    }
})

test('[CONTROLLER INSERT PRODUCT Test 5] Wrong version index in filesnams', async () => {
    const filesNames = ['aaaaaversion-1.jpg', 'aaaaaversion-2.jpg', 'aaaaaversion-3.jpg']
    const product = {...correctProduct}
    try{
        await newProduct(product, filesNames)
        assert.fail("Expected new Error")
    }catch(err){
        assert.equal(err.constructor.name, 'CTErrWrongFilesFormat')
    }
})

test('[CONTROLLER INSERT PRODUCT Test 6] Internal save files function failed', async () => {
    const filesNames = ['aaaaaversion-0.jpg', 'aaaaaversion-1.jpg', 'aaaaaversion-1.jpg']
    const product = {...correctProduct}
    try{
        await newProduct(product, filesNames)
    }catch(err){
        assert.equal(err.constructor.name, 'CTErrInsertingProduct')
    }finally{
        await disconnect()
    }
})

//This test need 4 files in tmp_files with the same name and extension as filesNames array defined below
/*
test('[CONTROLLER INSERT PRODUCT Test 7] Insert correct product and save files', async () => {
    const filesNames = ['pic1version-0.jpg', 'pic2version-0.jpg', 'pic3version-1.jpg', 'pic4version-1.jpg']
    const product = {...correctProduct}
    try{
        const id = await newProduct(product, filesNames)
        await deleteFullProduct(id)
    }catch(err){
        assert.fail(err)
    }finally{
        await disconnect()
    }
})
*/