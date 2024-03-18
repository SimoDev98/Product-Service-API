import { updatePrice, updateUnits, deleteProduct, verify } from "../controller/update-product.mjs";
import express from 'express'
import {sendError} from './server-config.mjs'
import { CTErrBadRequest, CTErrNotAuthorized } from "../errors/controller_errors.mjs";

export const UPDATE_ENDPOINTS = express()
UPDATE_ENDPOINTS.use(express.json())

UPDATE_ENDPOINTS.patch('/version/update-price', (req, res) => {
    try{
        let userId
        if(req.headers["user-rol"] == "supplier"){
            userId = req.headers["user-id"]
        }
        updatePrice({userId: userId, versionId: req.body.versionId, price: req.body.price})
        .then(products => res.status(200).send('The price of the version has been modified correctly'))
        .catch(err => {sendError(res, err)})
    }catch(err){ sendError(res, new CTErrBadRequest()) }
})

UPDATE_ENDPOINTS.patch('/version/available-units', (req, res) => {
    try{
        let userId
        if(req.headers["user-rol"] == "supplier"){
            userId = req.headers["user-id"]
        }
        updateUnits({userId: userId, versionId: req.body.versionId, availableUnits: req.body.availableUnits})
        .then(products => res.status(200).send('The available units of the version has been successfully modified'))
        .catch(err => {sendError(res, err)})
    }catch(err){ sendError(res, new CTErrBadRequest()) }
})

UPDATE_ENDPOINTS.delete('/product/delete-by-id', (req, res) => {
    try{
        
        if(req.headers["user-rol"] == "admin"){
            deleteProduct({ productId: req.body.productId }, true)
        }else if(req.headers["user-rol"] == "supplier"){
            deleteProduct({
                productId: req.body.productId,
                userId: req.headers["user-id"]
            }, false)
            .then(result => res.status(200).send('The product has been successfully deleted'))
            .catch(err => sendError(res, err))
        }
    }catch(err){ sendError(res, new CTErrBadRequest()) }
})

UPDATE_ENDPOINTS.patch('/product/verify', (req, res) => {
    try{
        if(req.headers['user-rol'] == 'admin'){
            verify({productId: req.body.productId})
            .then(result => res.status(200).send('The product has been verified successfully.'))
            .catch(err => sendError(res, err))
        }else{
            sendError(res, new CTErrNotAuthorized())
        }
    }catch(err){ sendError(res, new CTErrBadRequest()) }
})