import '../test-setup.mjs'
import test from 'node:test'
import assert from 'node:assert/strict'
import {versionModel} from '../../src/model/version-model.mjs'
import { Console } from 'node:console'
const MAX_LENGHT_VERSION_NAME = 30, MAX_NUM_FILE_NAME = 50, MAX_CHAR_FILE_NAME = 50
const AUTHORIZED_EXTENSIONS = process.env.AUTHORIZED_EXTENSIONS.split(',')

const testModel = versionModel.omit({presentation: true})

test('[VERSION MODEL Test 1] mandatory data', () => {
    const wrongObj = {}
    const requiredFields = ['name', 'price', 'availableUnits', 'characteristics', 'filesNames', 'currency']
    try{
        testModel.parse(wrongObj)
        assert.fail('Expected new Error')
    }catch(err){
        const failedFields = []
        err.errors.forEach(obj => {
            if(obj.message === 'Required'){
                failedFields.push(obj.path[0])
            }
        })
        requiredFields.forEach(field => {
            assert.ok(failedFields.includes(field))
        })
    }
})

test('[VERSION MODEL Test 2] name format', () => {
    let nameOverSize = ''
    for(let i = 0; i<MAX_LENGHT_VERSION_NAME + 1; i++){
        nameOverSize = nameOverSize.concat(' ')
    }
    const wrongInputs = [1, nameOverSize, '']
    const expectedErrorCodes = ['invalid_type', 'too_big', 'too_small']

    const ResultErrorCodes = []
        wrongInputs.forEach(input => {
            const wrongObject = {name: input}
            try{
                testModel.parse(wrongObject)
                assert.fail('Expected new Error')
            }catch(err){
                const wrongName = err.errors.find(obj => {
                    return obj.path[0] == 'name'
                })
                ResultErrorCodes.push(wrongName.code)
            }
        })
        expectedErrorCodes.forEach(expected => {
            assert.ok(ResultErrorCodes.includes(expected))
        })
});

test('[VERSION MODEL Test 3] price format', () => {
    const wrongInputs = [' ', 1.568, -1]
    const expectedErrorCodes = ['invalid_type', 'custom', 'too_small']

    let ResultErrorCodes = []
        wrongInputs.forEach(input => {
            const wrongObject = {price: input}
            try{
                testModel.parse(wrongObject)
                assert.fail('Expected new Error')
            }catch(err){
                const wrongPrice = err.errors.find(obj => {
                    return obj.path[0] == 'price'
                })
                ResultErrorCodes.push(wrongPrice.code)
            }
        })
        expectedErrorCodes.forEach(expected => {
            assert.ok(ResultErrorCodes.includes(expected))
        })
});

test('[VERSION MODEL Test 4] availableUnits format', () => {
    const wrongInputs = [' ', 1.1, -1]
    const expectedErrorCodes = ['invalid_type', 'invalid_type', 'too_small']

    let ResultErrorCodes = []
        wrongInputs.forEach(input => {
            const wrongObject = {availableUnits: input}
            try{
                testModel.parse(wrongObject)
                assert.fail('Expected new Error')
            }catch(err){
                const wrongAvailableUnits = err.errors.find(obj => {
                    return obj.path[0] == 'availableUnits'
                })
                ResultErrorCodes.push(wrongAvailableUnits.code)
            }
        })
        expectedErrorCodes.forEach(expected => {
            assert.ok(ResultErrorCodes.includes(expected))
        })
});

test('[VERSION MODEL Test 5] characteristics format', () => {
    let wrongObject = {characteristics: ' '}
    try{
        testModel.parse(wrongObject)
        assert.fail('Expected new Error')
    }catch(err){
        const characteristicsError = err.errors.find(obj => {
            return obj.path[0] === 'characteristics'
        })
        assert.equal('invalid_type', characteristicsError.code)
    }
    wrongObject = {characteristics: {}}
    try{
        testModel.parse(wrongObject)
        assert.fail('Expected new Error')
    }catch(err){
        const characteristicsError = err.errors.find(obj => {
            return obj.path[0] === 'characteristics'
        })
        assert.equal('custom', characteristicsError.code)
    }
    const correctObject = {characteristics: {a: 'a', b: true, c: 1}}
    try{
        testModel.parse(correctObject)
        assert.fail('Expected new Error') //There are other mandatory fields not defined
    }catch(err){
        const characteristicsError = err.errors.find(obj => {
            return obj.path[0] === 'characteristics'
        })
        assert.equal(characteristicsError, undefined)
    }
});

test('[VERSION MODEL Test 6]: filesNames format type', () => {
    //Wrong type
    const wrongVersion = {filesNames: 125}
    try{
        versionModel.parse(wrongVersion)
        assert.fail('Expected new Error')
    }catch(err){
        const fileNameError = err.errors.find(obj => {
            return obj.path[0] === 'filesNames'
        })
        let expected = 'array'
        assert.equal(expected, fileNameError.expected)
        
        expected = 'number'
        assert.equal(expected, fileNameError.received)
    }
});

test('[VERSION MODEL Test 7]: filesNames format oversize array', () => {
    const array = []
    for(let i = 0; i<MAX_NUM_FILE_NAME + 1; i++){
        array[i] = 'aaa'
    }

    const wrongVersion = {filesNames: array}
    
    try{
        versionModel.parse(wrongVersion)
        assert.fail('Expected new Error')
    }catch(err){
        const fileNameError = err.errors.find(obj => {
            return obj.code === 'too_big' && obj.path[0] === 'filesNames'
        })
        
        assert.ok(wrongVersion.filesNames.length > fileNameError.maximum)
    }
});

test('[VERSION MODEL Test 8]: filesNames format empty array', () => {
    const array = []
    const wrongVersion = {filesNames: array}
    
    try{
        versionModel.parse(wrongVersion)
        assert.fail('Expected new Error')
    }catch(err){
        const fileNameError = err.errors.find(obj => {
            return obj.code === 'too_small' && obj.path[0] === 'filesNames'
        })

        assert.ok(wrongVersion.filesNames.length < fileNameError.minimum)
    }
});

test('[VERSION MODEL Test 9]: filesNames content format type', () => {
    const array = [25]
    const wrongVersion = {filesNames: array}

    try{
        versionModel.parse(wrongVersion)
        assert.fail('Expected new Error')
    }catch(err){
        const fileNameError = err.errors.find(obj => {
            return obj.path[0] === 'filesNames'
        })

        assert.notEqual(fileNameError.expected, 'number')
    }
});

test('[VERSION MODEL Test 10]: filesNames content format max lenght', () => {
    let field = ''
    for(let i = 0; i<MAX_CHAR_FILE_NAME + 1; i++){
        field = field.concat(' ')
    }
    const array = [field]
    const wrongVersion = {filesNames: array}

    try{
        versionModel.parse(wrongVersion)
        assert.fail('Expected new Error')
    }catch(err){
        const fileNameError = err.errors.find(obj => {
            return obj.path[0] === 'filesNames' && obj.code === 'too_big'
        })

        assert.ok(wrongVersion.filesNames[0].length > fileNameError.maximum)
    }
});

test('[VERSION MODEL Test 11]: filesNames content format wrong extension', () => {
    const array = ['a.fasdfa']
    const wrongVersion = {filesNames: array}

    try{
        versionModel.parse(wrongVersion)
        assert.fail('Expected new Error')
    }catch(err){
        const fileNameError = err.errors.find(obj => {
            return obj.path[0] === 'filesNames' && obj.code === 'custom'
        })

        assert.equal('File extension not authorized', fileNameError.message)
    }
});

test('[VERSION MODEL Test 12]: filesNames correct format', () => {
    let array = []
    AUTHORIZED_EXTENSIONS.forEach(extension => {
        array.push('aaaversion-1' + extension)
    })
    const correctVersion = {
        name: 'v.1',
        price: 124.99,
        availableUnits: 100,
        characteristics: {a: 'aaa', b: true, c: 5},
        longDescription: "Long description",
        filesNames: array,
        currency: 'USD'
    }
    const parsed = versionModel.parse(correctVersion)
    assert.equal(Object.keys(correctVersion).length, Object.keys(parsed).length)
    assert.ok(Object.keys(correctVersion)[0] == Object.keys(parsed)[0])
    assert.equal(correctVersion.filesNames.length, parsed.filesNames.length)
    for(let i = 0; i < correctVersion; i++){
        assert.equal(correctVersion.filesNames[i], correctVersion.filesNames[i])
    }
});