import '../test-setup.mjs'
import test from "node:test"
import assert from "node:assert/strict"
import {z} from 'zod'
import {productModel} from '../../src/model/product-model.mjs'
const MAX_CHAR_NAME = 50, MAX_CHAR_SHOR_DESCRIPTION = 200,
MAX_CHAR_BRAND = 30, MAX_VERSIONS = 100

const testModel = productModel.omit({versions: true})

test('[PRODUCT MODEL Test 1] Mandatory data', () =>{
    const wrongObj = {}
    const requiredFields = ['name', 'shortDescription', 'brand', 'userId', 'tags']
    try{
        testModel.parse(wrongObj)
        assert.fail('Expected new Error')
    }catch(err){
        const fieldsFailed = []
        err.errors.forEach(obj => {
            fieldsFailed.push(obj.path[0])
        })
        requiredFields.forEach(field => {
            assert.ok(fieldsFailed.includes(field))
        })
    }
})

function getOversizedString(size){
    let result = ''
    for(let i = 0; i < size + 1; i++){
        result = result.concat(' ')
    }
    return result
}

test('[PRODUCT MODEL Test 2] name, shortDescription and brand format', () => {
    const wrongInputs = [1, '']
    const requiredFields = ['name', 'shortDescription', 'brand']

    let wrongObj = {
        name: wrongInputs[0],
        shortDescription: wrongInputs[0],
        brand: wrongInputs[0]
    }

    try{
        testModel.parse(wrongObj)
        assert.fail("Expeced new Error")
    }catch(err){
        const fieldsFailed = []
        err.errors.forEach(obj => {
            if(obj.code === 'invalid_type'){
                fieldsFailed.push(obj.path[0])
            }
        })
        requiredFields.forEach(field => {
            assert.ok(fieldsFailed.includes(field))
        })
    }

    wrongObj = {
        name: wrongInputs[1],
        shortDescription: wrongInputs[1],
        brand: wrongInputs[1]
    }

    try{
        testModel.parse(wrongObj)
        assert.fail("Expeced new Error")
    }catch(err){
        const fieldsFailed = []
        err.errors.forEach(obj => {
            if(obj.code === 'too_small'){
                fieldsFailed.push(obj.path[0])
            }
        })
        requiredFields.forEach(field => {
            assert.ok(fieldsFailed.includes(field))
        })
    }

    wrongObj = {
        name: getOversizedString(MAX_CHAR_NAME),
        shortDescription: getOversizedString(MAX_CHAR_SHOR_DESCRIPTION),
        brand: getOversizedString(MAX_CHAR_BRAND)
    }

    try{
        testModel.parse(wrongObj)
        assert.fail("Expeced new Error")
    }catch(err){
        const fieldsFailed = []
        err.errors.forEach(obj => {
            if(obj.code === 'too_big'){
                fieldsFailed.push(obj.path[0])
            }
        })
        requiredFields.forEach(field => {
            assert.ok(fieldsFailed.includes(field))
        })
    }
})

test('[PRODUCT MODEL Test 3] tags format', () => {
    const wrongInputs = ["#a-", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", '']
    wrongInputs.forEach(input => {
        const wrongProduct = {
            tags: [input]
        }
        try{
            testModel.parse(wrongProduct)
            assert.fail('Expected new Error')
        }catch(err){ //console.log(err.errors)
            const fail = err.errors.find(obj => {
                return obj.path[0] === 'tags'
            })
            assert.equal(fail.code, 'custom')
        }
    })

    const product = {
        tags: ['electronics', 'CR7', 'Reebook']
    }
    try{
        testModel.parse(product)
        assert.fail('Expected new Error')
    }catch(err){
        const fail = err.errors.find(obj => {
            return obj.path[0] === 'tags'
        })
        assert.equal(fail, undefined)
    }



})