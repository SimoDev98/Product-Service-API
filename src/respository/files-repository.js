const fs = require('node:fs')
const path = require('node:path')
const aws = require('aws-sdk');
const { promisify } = require('node:util');

function getFilePath(name){
    return path.resolve(__dirname, '..', 'tmp_files_storage', name)
}

aws.config.update({
    accessKeyId: process.env.AWS_S3_BUCKET_ACCESS_ID,
    secretAccessKey: process.env.AWS_S3_BUCKET_SECRECT_ACCESS_KEY
});
const s3 = new aws.S3()

async function saveFiles(filesname){
    const params = {
        Body: '',
        Key: '',
        Bucket: process.env.AWS_S3_BUCKET_NAME
    }
    try{
        for(const filename of filesname){
            params.Body = fs.readFileSync(getFilePath(filename))
            params.Key = filename
            await s3.upload(params).promise()
            fs.unlink(getFilePath(filename), (err) => {
                if(err){
                    throw new Error()
                }
            })
        }
    }catch(err){
        throw new Error("[SAVE FILES] Cannot save file because of the following error: " + err);
    }
}

function deleteFiles(filesname){
    const params = {
        Key: '',
        Bucket: process.env.AWS_S3_BUCKET_NAME
    }
    return new Promise((resolve, reject) => {
        for(const filename of filesname){
            params.Key = filename
            s3.deleteObject(params)
        }
    })
}

function getURLFileStorage(){
    return process.env.AWS_S3_BUCKET_URL
}

module.exports = {saveFiles, getURLFileStorage, deleteFiles}