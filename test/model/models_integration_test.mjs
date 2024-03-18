import '../test-setup.mjs'
import test from "node:test"
import assert from "node:assert/strict"
import {productModel} from '../../src/model/product-model.mjs'


function buildCorrectProduct(){
    const version1 = {
        name: 'v.1',
        price: 24.99,
        availableUnits: 125,
        characteristics: {longCM: 50, heighCM:30, material: 'zinc'},
        longDescription: 'Long description...',
        filesNames: ['pic1version-1.jpg', 'docversion-1.tif', 'videoversion-1.mp4'],
        currency: 'USD'
    }
    
    const version2 = {
        name: 'v.2',
        price: 24.99,
        availableUnits: 125,
        characteristics: {longCM: 50, heighCM:30, material: 'zinc'},
        longDescription: 'Long description...',
        filesNames: ['pic1version-2.jpg', 'docversion-2.tif', 'videoversion-2.mp4'],
        currency: 'JPY'
    }
    
    const product = {
        versions: [version1, version2],
        name: 'Product name',
        shortDescription: 'Short description',
        brand: 'brand',
        tags:['electronics', 'mouse'],
        userId: '1234'
    }
    return product
}

test('[MODELS INTEGRATION Test 1] correct product implementation', () => {
    try{
        productModel.parse(buildCorrectProduct())
    }catch(err){
        assert.fail(err)
    }
})


test('[MODELS INTEGRATION Test 3] error on version', () => {
    const product = buildCorrectProduct()
    product.versions[0].name = '' //Wrong format
    try{
        productModel.parse(product)
        assert.fail('Expected new Error')
    }catch(err){
        const fail = err.errors.find(obj => {
            return obj.path[obj.path.length - 1] === 'name'
        })
        assert.equal(fail.code, 'too_small')
    }
})

test('[MODELS INTEGRATION Test 4] error on product', () => {
    const product = buildCorrectProduct()
    product.name = '' //Wrong format
    try{
        productModel.parse(product)
        assert.fail('Expected new Error')
    }catch(err){
        const fail = err.errors.find(obj => {
            return obj.path[obj.path.length - 1] === 'name'
        })
        assert.equal(fail.code, 'too_small')
    }
})
