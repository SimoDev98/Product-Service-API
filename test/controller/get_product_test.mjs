import '../test-setup.mjs'
import {test} from "node:test"
import assert from "node:assert/strict"
import { connect, disconnect } from "../../src/database/mongodb-config.mjs"
import { deleteFullProduct, insertFullProduct } from '../../src/respository/mdb-product-repository.mjs'
import {ctGetProductsOfOwner, getProductById, getProductsBySearch, getProductsByUserId, getUnverfieds} from '../../src/controller/get-product.mjs'
/*
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
            filesNames: [],
            currency: 'EUR'
        },
        {
            name: 'v.1',
            price: 12.50,
            availableUnits: 1000,
            characteristics: {a: 'a', b: true, c: 125},
            filesNames: [],
            currency: 'EUR'
        }
    ],
    isVerified: true
}


test('[GET PRODUCTS CONTROLLER Test 1] Get non-verified products.', async () => {
    try{
        correctProduct.isVerified = false
        const id = await insertFullProduct(correctProduct)
        let products = await getProductsBySearch({search: "", tags: []})
        for(const product of products.products){
            if(product._id.toString() == id && !product.isVerified){
                throw new Error()
            }
        }
        products = await getProductsByUserId({userId: correctProduct.userId})
        for(const product of products.products){
            if(product._id.toString() == id && !product.isVerified){
                throw new Error()
            }
        }
        products = await ctGetProductsOfOwner({userId: correctProduct.userId})
        let checkProduct
        for(const product of products.products){
            if(product._id.toString() == id){
                checkProduct = product
            }
        }
        assert.notEqual(checkProduct, undefined)
        checkProduct = undefined
        products = await getUnverfieds()
        for(const product of products.products){
            if(product._id.toString() == id){
                checkProduct = product
            }
        }
        assert.notEqual(checkProduct, undefined)
        try{
            products = await getProductById({productId: id})
        }catch(err){
            assert.equal(err.constructor.name, 'CTErrNotAvailable')
        }
        await deleteFullProduct(id)
    }catch(err){
        assert.fail('Unexpected error. Error: '+err)
    }
})

test('[GET PRODUCTS CONTROLLER Test 2] Get verified products.', async () => {
    try{
        correctProduct.isVerified = true
        const id = await insertFullProduct(correctProduct)

        let products = await getProductsBySearch({search: "", tags: []})
        let checkProduct
        for(const product of products.products){
            if(product._id.toString() == id){
                checkProduct = product
            }
        }
        assert.notEqual(checkProduct, undefined)

        products = await getProductsByUserId({userId: correctProduct.userId})
        for(const product of products.products){
            if(product._id.toString() == id){
                checkProduct = product
            }
        }
        assert.notEqual(checkProduct, undefined)

        products = await ctGetProductsOfOwner({userId: correctProduct.userId})
        checkProduct = undefined
        for(const product of products.products){
            if(product._id.toString() == id){
                checkProduct = product
            }
        }
        assert.notEqual(checkProduct, undefined)

        products = await ctGetProductsOfOwner({userId: '65655485'}) //Non-existing userId
        for(const product of products.products){
            if(product._id.toString() == id && !product.isVerified){
                throw new Error()
            }
        }

        products = await getUnverfieds()
        for(const product of products.products){
            if(product._id.toString() == id && !product.isVerified){
                throw new Error()
            }
        }

        products = await getProductById({productId: id})
        assert.equal(products.product._id.toString(), id)

        await deleteFullProduct(id)
    }catch(err){
        assert.fail('Unexpected error. Error: '+err)
    }finally{
        await disconnect()
    }
})
*/