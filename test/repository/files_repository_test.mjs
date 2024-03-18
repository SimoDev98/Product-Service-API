import '../test-setup.mjs'
import test from "node:test"
import assert from "node:assert/strict"
import {saveFiles} from "../../src/respository/files-repository.js"

//Requires a file in /src/tmp_files_storage with name pic1version-0.jpg
//Perform a wrong values for your S3 bucket in the config file .env
/*
test('[FILES REPOSITORY Test 1] Wrong access config.', async () => {
    try{
        const filesname = ["pic1version-0.jpg"]
        await saveFiles(filesname)
        assert.fail('Expected new error')
    }catch(err){
        assert.ok(err.message.includes('InvalidAccessKeyId'))
    }
})*/

//Requires a file in /src/tmp_files_storage with name pic1version-0.jpg
test('[FILES REPOSITORY Test 2] Upload file.', async () => {
    try{
        const filesname = ["pic1version-0.jpg"]
        await saveFiles(filesname)
    }catch(err){
        console.log(err)
        assert.fail('Unexpected error')
    }
})