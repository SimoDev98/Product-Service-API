import express from 'express'
import multer from 'multer'
import { newProduct } from '../controller/insert-product.mjs'
import { v4 as uuidv4 } from 'uuid';
import { MAX_VERSIONS } from '../model/product-model.mjs'
import {sendError} from './server-config.mjs'
import { CTErrBadRequest } from '../errors/controller_errors.mjs'
import {join, dirname} from 'path'
import { fileURLToPath } from "url";


export const INSERT_ENDPOINTS = express()
const FILES_TEMPORARY_STORAGE_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'tmp_files_storage')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, FILES_TEMPORARY_STORAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + file.originalname)
    }
})
const upload = multer({storage: storage})
const MAX_FILES_PER_VERSION = 10
const MAX_FILES = MAX_FILES_PER_VERSION * MAX_VERSIONS

INSERT_ENDPOINTS.post('/product', upload.array('files', MAX_FILES), (req, res) => {
    try{
        if(req.headers["user-rol"] != "supplier" && req.headers["user-rol"] != "admin"){
            userId = req.headers["user-id"]
        }
        const filesNames = []
        for(const file of req.files){
            filesNames.push(file.filename)
        }
        newProduct(JSON.parse(req.body.product), filesNames)
        .then(result => res.status(200).send('The product has been inserted successfully'))
        .catch(err => {
            console.log(err)
            sendError(res, err)})
    }catch(err){
        console.log(err)
        sendError(res, new CTErrBadRequest())
    }
})