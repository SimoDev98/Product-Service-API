import {verifyProduct, deleteFullProduct, checkUserIdVersion, checkUserIdProductId, getFullProductById} from '../respository/mdb-product-repository.mjs'
import {updateVersionPrice, updateAvailableUnits} from '../respository/mdb-version-respository.mjs'
import {CTErrBadRequest, CTErrNotAuthorized, CTErrInternalServerError, CTErrImpossibleVerifyProduct} from '../errors/controller_errors.mjs'
import {z} from 'zod'
import {isMongodbIdHexadecimal} from '../helper/mongodb_id_verifier.mjs'
import {isUserId} from '../helper/user_id_verifier.mjs'
import {versionModel} from '../model/version-model.mjs'
import {deleteFiles} from '../respository/files-repository.js'

const updatePriceSchema = versionModel.pick({price: true}).merge(z.object({
    userId: z.string().refine(str => {return isUserId(str)}),
    versionId: z.string().refine(str => {return isMongodbIdHexadecimal(str)})
}))
const updateAvailableUnitsSchema = versionModel.pick({availableUnits: true}).merge(z.object({
    userId: z.string().refine(str => {return isUserId(str)}),
    versionId: z.string().refine(str => {return isMongodbIdHexadecimal(str)})
}))

const deleteProductSchema = z.object({
    userId: z.optional(z.string().refine(str => {return isUserId(str)})),
    productId: z.string().refine(str => {return isMongodbIdHexadecimal(str)})
})

export function updatePrice(body){
    return new Promise((resolve, reject) => {
         try{
            updatePriceSchema.parse(body)
         }catch(err){
            reject(new CTErrBadRequest())
         }
         checkUserIdVersion(body.versionId, body.userId)
         .then(isAuthorized => {
            if(isAuthorized){
                updateVersionPrice(body.versionId, body.price)
                .then(result => resolve(true))
                .catch(err => reject(new CTErrInternalServerError()))
            }else{
                reject(new CTErrNotAuthorized())
            }
         })
         .catch(err => reject(new CTErrInternalServerError()))
    })
}

export function updateUnits(body){
    return new Promise((resolve, reject) => {
         try{
            updateAvailableUnitsSchema.parse(body)
         }catch(err){
            reject(new CTErrBadRequest())
         }
         checkUserIdVersion(body.versionId, body.userId)
         .then(isAuthorized => {
            if(isAuthorized){
                updateAvailableUnits(body.versionId, body.availableUnits)
                .then(result => resolve(true))
                .catch(err => reject(new CTErrInternalServerError()))
            }else{
                reject(new CTErrNotAuthorized())
            }
         })
    })
}

export function deleteProduct(body, isAdmin){
    return new Promise((resolve, reject) => {
         try{
            deleteProductSchema.parse(body)
         }catch(err){
            reject(new CTErrBadRequest())
         }
         if(!isAdmin){
            checkUserIdProductId(body.productId, body.userId)
            .then(isAuthorized => {
               if(isAuthorized){
                   const product = getFullProductById(body.productId)
                   deleteFullProduct(body.productId)
                   .then(result => {
                        const filesname = []
                        for(const version of product.versions){
                            for(const filename of version.filesNames){
                                filesname.push(filename)
                            }
                        }
                        deleteFiles(filesname)
                        .then(() => resolve(true))
                        .catch(err => reject(new CTErrInternalServerError()))
                        
                   })
                   .catch(err => reject(new CTErrInternalServerError()))
               }else{
                   reject(new CTErrNotAuthorized())
               }
            })
            .catch(err => reject(new CTErrInternalServerError()))
         }else{
            deleteFullProduct(body.productId)
            .then(result => resolve(true))
            .catch(err => reject(new CTErrInternalServerError()))
         }
         
    })
}

export function verify(body){
    return new Promise((resolve, reject) => {
        try{
            deleteProductSchema.pick({productId: true}).parse(body)
        }catch(err){
            reject(new CTErrBadRequest())
        }
        verifyProduct(body.productId)
        .then(result => resolve(true))
        .catch(err => reject(new CTErrImpossibleVerifyProduct()))
    })
}