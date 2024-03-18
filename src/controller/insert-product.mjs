import { productModel } from '../model/product-model.mjs'
import { CTErrInsertingProduct, CTErrWrongFormatProduct, CTErrWrongFilesFormat } from '../errors/controller_errors.mjs'
import { deleteFullProduct, insertFullProduct } from '../respository/mdb-product-repository.mjs'
import { saveFiles } from "../respository/files-repository.js"
import { getVersionOfFile } from '../helper/filename-helper.mjs'

export function newProduct(obj, filesNames){
    return new Promise(async (resolve, reject) => {
        let versions, product;
        try {
            if ('versions' in obj) {
                versions = assignFilesToVersions(obj.versions, filesNames);
            } else {
                throw new CTErrWrongFormatProduct("versions is mandatory field.");
            }
            product = checkProduct(obj);
            product.versions = productModel.pick({ versions: true }).parse({ versions: versions }).versions;
            product.isVerified = true
            insertFullProduct(product)
            .then(async (id) => {
                try{
                    await saveFiles(filesNames)
                    resolve(id)
                }catch(err){
                    deleteFullProduct(id)
                    .then(result => {
                        reject(new CTErrInsertingProduct())
                    })
                    .catch(err => reject(new CTErrInsertingProduct())) //Fatal error. Need external error manager service.
                }
            })
            .catch(err => {
                reject(new CTErrInsertingProduct())
            })
            
        } catch (err) {
            reject(err);
        }
    })
}

function checkProduct(obj){
    try{
        const product = productModel.omit({versions: true}).parse(obj)
        product.isVerified = false
        return product
    }catch(err){
        throw new CTErrWrongFormatProduct(err)
    }
}

function assignFilesToVersions(versions, filesNames){
    if(filesNames == undefined || filesNames.length == 0){
        throw new CTErrWrongFilesFormat("Request has no files.")
    }
    try{
        for(const fileName of filesNames){
            const versionIndex = getVersionOfFile(fileName)
            if(versionIndex >= versions.length || versionIndex < 0){
                throw new CTErrWrongFilesFormat("Version index out of bounds")
            }
            versions[versionIndex].filesNames.push(fileName)
        }
    return versions
    }catch(err){
        throw new CTErrWrongFilesFormat(err)
    }
}