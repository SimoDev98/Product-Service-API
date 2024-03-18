import {getFullProductById, getFullProductsBySearch, getFullProductsByUserId, getProductsOfOwner, getUnverifiedProducts} from '../respository/mdb-product-repository.mjs'
import {CTErrBadRequest, CTErrInternalServerError, CTErrNotAvailable} from '../errors/controller_errors.mjs'
import {isMongodbIdHexadecimal} from '../helper/mongodb_id_verifier.mjs'
import {isUserId} from '../helper/user_id_verifier.mjs'
import {z} from 'zod'
import { getURLFileStorage } from '../respository/files-repository.js'

const byIdSchema = z.object({
    productId: z.string().refine(str => {return isMongodbIdHexadecimal(str)})
})
const bySearchSchema = z.object({
    search: z.string(),
    tags: z.optional(z.array(z.string().min(1).max(100)).max(100))
})
const byUserIdSchema = z.object({
    userId: z.string().refine(str => {return isUserId(str)})
})

//Returns a verified product by a product id. For [CLIENT]
export function getProductById(body){
    return new Promise((resolve, reject) => {
        try{
            byIdSchema.parse(body)
        }catch(err){
            reject(new CTErrBadRequest())
        }
        getFullProductById(body.productId)
        .then(product => {
            if(product.isVerified){
                resolve({product: product, urlFilesStorage: getURLFileStorage()})
            }else{
                reject(new CTErrNotAvailable())
            }
        })
        .catch(err => {
            console.log(err)
            if(err.constructor.name == 'RPErrProductNotFound'){
                reject(err)
            }else{
                reject(new CTErrInternalServerError())
            }
        })
    })
}

//Returns all verified products by search. For [CLIENT]
export function getProductsBySearch(body){ //Client
    return new Promise((resolve, reject) => {
        try{
            bySearchSchema.parse(body)
        }catch(err){
            reject(new CTErrBadRequest())
        }
        getFullProductsBySearch(body.search, body.tags)
        .then(products =>{
            if(products.length == 0){reject(new CTErrNotAvailable())}
            else{resolve({products: products, urlFilesStorage: getURLFileStorage()})}
        })
        .catch(err => {
            reject(new CTErrInternalServerError())
        })
    })
}

//Returns all verified products of a user by its user id. For [CLIENT]
export function getProductsByUserId(body){
    return new Promise((resolve, reject) => {
        try{
            byUserIdSchema.parse(body)
        }catch(err){
            reject(new CTErrBadRequest())
        }
        getFullProductsByUserId(body.userId)
        .then(products => {
            if(products.length == 0){reject(new CTErrNotAvailable())}
            else{resolve({products: products, urlFilesStorage: getURLFileStorage()})}
        })
        .catch(err => {
            reject(new CTErrInternalServerError())
        })
    })
}

//Returns all unverified products. For [ADMIN]
export function getUnverfieds(){
    return new Promise((resolve, reject) => {
        getUnverifiedProducts()
        .then(products => {
            if(products.length == 0){reject(new CTErrNotAvailable())}
            else{resolve({products: products, urlFilesStorage: getURLFileStorage()})}
        })
        .catch(err => reject(new CTErrInternalServerError()))
    })
}

//Returns all verified and unverified products of a user. For [SUPPLIER, ADMIN]
export function ctGetProductsOfOwner(body){ //Only for admin and supplier owner accounts
    return new Promise((resolve, reject) => {
        try{
            byUserIdSchema.parse(body)
        }catch(err){
            reject(new CTErrBadRequest())
        }
        getProductsOfOwner(body.userId)
        .then(products => {
            if(products.length == 0){reject(new CTErrNotAvailable())}
            else{resolve({products: products, urlFilesStorage: getURLFileStorage()})}
        })
        .catch(err => reject(new CTErrInternalServerError()))
    })
}