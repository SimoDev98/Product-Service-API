import {sendError} from './server-config.mjs'
import {ctGetProductsOfOwner, getProductById, getProductsBySearch, getProductsByUserId, getUnverfieds} from '../controller/get-product.mjs'
import express from 'express'
import { CTErrBadRequest, CTErrNotAuthorized } from '../errors/controller_errors.mjs'

export const GET_ENDPOINTS = express()
GET_ENDPOINTS.get('/product/id', (req, res) => {
    getProductById({productId: req.query.id})
    .then(product => res.status(200).send(product))
    .catch(err => {sendError(res, err)})
})

GET_ENDPOINTS.get('/product/search', (req, res) => {
    try{
        const query = { 
            search: req.query.search,
            tags: []
        }
        if('tags' in req.query){ query.tags = req.query.tags.split(',') }

        getProductsBySearch(query)
        .then(products => res.status(200).send(products))
        .catch(err => {sendError(res, err)})
    }catch(err){ sendError(res, new CTErrBadRequest()) }
})

GET_ENDPOINTS.get('/product/unverified-products', (req, res) => {
    try{
        if(req.headers["user-rol"] == "admin"){
            getUnverfieds()
            .then(products => res.status(200).send(products))
            .catch(err => {sendError(res, err)})
        }else{
            sendError(res, new CTErrNotAuthorized())
        }
    }catch(err){ sendError(res, new CTErrBadRequest()) }
})

GET_ENDPOINTS.get('/product/products-by-user-id', (req, res) => {
    getProductsByUserId({userId: req.query.id})
    .then(products => res.status(200).send(products))
    .catch(err => {sendError(res, err)})
})

GET_ENDPOINTS.get('/product/products-of-owner-by-user-id', (req, res) => {
    try{
        let userId
        if(req.headers["user-rol"] == "admin"){
            userId = req.query["user-id"]
        }else if(req.headers["user-rol"] == "supplier"){
            userId = req.headers["user-id"]
        }
        ctGetProductsOfOwner({userId: userId})
        .then(products => res.status(200).send(products))
        .catch(err => {sendError(res, err)})
    }catch(err){ sendError(res, new CTErrBadRequest()) }
})
