import '../test-setup.mjs'
import test from "node:test"
import assert from "node:assert/strict"
import { connect, disconnect } from '../../src/database/mongodb-config.mjs'
import { getFullProductById, deleteFullProduct, verifyProduct, addTags, deleteTags, getFullProductsBySearch, getFullProductsByUserId, insertFullProduct, checkUserIdVersion, checkUserIdProductId } from '../../src/respository/mdb-product-repository.mjs'

await connect()

test('[PRODUCT REPOSITORY Test 1] Get product by id wrong', async () => {
    try {
        const id = '65ca99cb39aed86686bf8662'
        await getFullProductById(id)
        assert.fail('Expected new Error')
    } catch (err) {
        assert.equal(err.constructor.name, 'RPErrProductNotFound')
    }
})

test('[PRODUCT REPOSITORY Test 2] Delete non-existing product', async () => {
    try {
        const id = '65ca99cb39aed86686bf8662'
        await deleteFullProduct(id)
        assert.fail('Expected new Error')
    } catch (err) {
        assert.equal(err.constructor.name, 'RPErrProductNotFound')
    }
})

test('[PRODUCT REPOSITORY Test 3] Verify product', async () => {
    try {
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
            isVerified: false
        }

        const id = await insertFullProduct(product)
        await verifyProduct(id)
        const updatedProduct = await getFullProductById(id)
        assert.ok(updatedProduct.isVerified)
        await deleteFullProduct(id)
    } catch (err) {
        assert.fail("Unexpected error: " + err)
    }
})

test('[PRODUCT REPOSITORY Test 4] Add and delete tags', async () => {
    try {
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
            isVerified: false
        }

        const tags = ['tag1', 'tag2', 'tag3']
        product.tags = tags
        const id = await insertFullProduct(product)
        const newTags = ['tag4', 'tag5', 'tag6']

        //Add new tags
        await addTags(id, newTags)
        let updatedProduct = await getFullProductById(id)
        const joinTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
        joinTags.forEach(tag => {
            assert.ok(updatedProduct.tags.includes(tag))
        })
        //Delete some tags
        await deleteTags(id, newTags)
        updatedProduct = await getFullProductById(id)
        tags.forEach(tag => {
            assert.ok(updatedProduct.tags.includes(tag))
        })
        newTags.forEach(tag => {
            assert.ok(!updatedProduct.tags.includes(tag))
        })
        await deleteFullProduct(id)
    } catch (err) {
        assert.fail("Unexpected error: " + err)
    }
})

test('[PRODUCT REPOSITORY Test 5] Get full products by search', async () => {
    try {
        const product1 = {
            name: 'ProduseArch1ct 1', //Match
            shortDescription: "Short description",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            versions: [{longDescription: "Long description search1"}],
            isVerified: true
        }
        const product2 = {
            name: 'Produt 2',
            shortDescription: "Short description",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            versions: [{longDescription: "Long description search1"}], //Match
            isVerified: true
        }
        const product3 = {
            name: 'Produt 3',
            shortDescription: "Short description search1",
            tags: ["tag1", "tag2"],
            versions: [{longDescription: "Long description"}], //Match
            isVerified: true
        }
        const product4 = {
            name: 'Produt 4',
            shortDescription: "Short description",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            versions: [{longDescription: "Long description"}],
            isVerified: true
        }

        const product_ids = []
        product_ids.push(await insertFullProduct(product1))
        product_ids.push(await insertFullProduct(product2))
        product_ids.push(await insertFullProduct(product3))
        product_ids.push(await insertFullProduct(product4))
        const search = 'search1'
        const tags = []
        let products = await getFullProductsBySearch(search, tags)
        assert.equal(products.length, 3)
        tags.push("tag3")
        tags.push("tag4")
        products = await getFullProductsBySearch(search, tags)
        assert.equal(products.length, 2)
        
        for(const id of product_ids){
            await deleteFullProduct(id)
        }
    } catch (err) {
        assert.fail(err)
    }
})

test('[PRODUCT REPOSITORY Test 6] Get products by userId', async () => {
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

        const version2 = {
            name: 'v.1',
            price: 124.99,
            availableUnits: 100,
            characteristics: {power: "50kW", batteryDuration: "12h"}
        }
        const product2 = {
            name: 'vacum',
            shortDescription: 'This is a short description.',
            brand: 'Electronics Inc.',
            userId: '12224589891',
            versions: [version2],
            isVerified: true
        }

        const id1 = await insertFullProduct(product)
        const id2 = await insertFullProduct(product2)

        const fullProduct = (await getFullProductsByUserId(product.userId))
        assert.equal(fullProduct.length, 1)
        assert.equal(fullProduct[0]._id.toString(), id1)
        await deleteFullProduct(id1)
        await deleteFullProduct(id2)
    }catch(err){
        assert.fail("Unexpected error: "+err)
    }
})

test('[PRODUCT REPOSITORY Test 7] Insert full product.', async () => {
    try{
        const version1 = {
            name: 'v1',
            longDescription: 'Long description'
        }
        const version2 = {
            name: 'v1',
            longDescription: 'Long description'
        }
        const product = {
            name: 'Product 1',
            shortDescription: 'Short description',
            versions: [version1, version2],
            isVerified: true
        }
        const id = await insertFullProduct(product)
        const result = await getFullProductById(id)
        assert.equal(result._id.toString(), id)
        assert.equal(result.versions.length, 2)
        await deleteFullProduct(id)
    }catch(err){
        assert.fail("Unexpected error: "+err)
    }
})

test('[PRODUCT REPOSITORY Test 8] Check userId with ProductId and versionId', async () => {
    const version1 = {
        name: 'v1',
        longDescription: 'Long description'
    }
    const version2 = {
        name: 'v2',
        longDescription: 'Long description'
    }
    const product1 = {
        name: 'Product 1',
        shortDescription: 'Short description',
        versions: [version1, version2],
        isVerified: true,
        userId: '1225554'
    }
    try{
        
        //Expected authorized
        const id1 = await insertFullProduct(product1)
        const product = await getFullProductById(id1)
        assert.ok(await checkUserIdProductId(id1, product1.userId))
        assert.ok(await checkUserIdVersion(product.versions[0]._id.toString(), product1.userId))
        //Expected not authorized
        assert.ok(!(await checkUserIdProductId(id1, "122555496")))
        assert.ok(!(await checkUserIdProductId("5f7c7ae166f3700024a29a12", product1.userId)))
        assert.ok(!(await checkUserIdProductId("5f7c7ae166f3700024a29a12", "122555496")))

        assert.ok(!(await checkUserIdVersion(product.versions[0]._id.toString(), "122555496")))
        assert.ok(!(await checkUserIdVersion("5f7c7ae166f3700024a29a12", product1.userId)))
        assert.ok(!(await checkUserIdVersion("5f7c7ae166f3700024a29a12", "122555496")))
        await deleteFullProduct(id1)
    }catch(err){
        assert.fail("Unexpected error: "+err)
    }finally{
        await disconnect()
    }
})