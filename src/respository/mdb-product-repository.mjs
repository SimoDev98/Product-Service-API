import { ObjectId } from "mongodb"
import { getCollection, getJoinedCollection, transaction } from "../database/mongodb-config.mjs"
import { RPErrProductNotFound, RPErrImpossibleAddTags, RPErrImpossibleDeleteTags, RPErrImpossibleFindByUserId, RPErrImpossibleInsertFullProduct, RPErrImpossibleVerifyProduct} from "../errors/repository_errors.mjs"

export function getFullProductById(id) {
  return new Promise((resolve, reject) => {
    getFullProductsByQuery({ $match: { _id: {$eq: new ObjectId(id)}}})
    .then(products => {
      if (products.length == 0) {
        reject(new RPErrProductNotFound())
      } else {
        resolve(products[0])
      }
    })
    .catch(err => reject(err))
    
  })
}

function getFullProductsByQuery(query) {
  const aggregations = [
    {
      $lookup: {
        from: "version",
        localField: "_id",
        foreignField: "productId",
        as: "versions"
      }
    },
    {
      $unwind: "$versions"
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        brand: { $first: "$brand" },
        tags: { $first: "$tags" },
        versions: { $push: "$versions" },
        userId: { $first: "$userId" },
        shortDescription: { $first: "$shortDescription"},
        isVerified: { $first: "$isVerified" },
        ownerRef: {$first: "$ownerRef"},
      }
    },
    query
  ];
  return new Promise((resolve, reject) => {
    getJoinedCollection(aggregations, 'product')
    .then(cursor => {
      cursor.toArray()
      .then(array => resolve(array))
      .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}

export function deleteFullProduct(id) {
  return new Promise(async (resolve, reject) => {
      const PRODUCTS = getCollection('product')
      const VERSIONS = getCollection('version')
      getFullProductById(id)
      .then(product => {
        transaction(async (session) => {
          if('versions' in product){
            await VERSIONS.deleteMany({ productId: {$eq: product._id}}, { session });
          }
          await PRODUCTS.deleteOne({ _id: product._id }, { session });
        })
        .then(result => resolve(true))
        .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
  
}

export function verifyProduct(id){
  return new Promise((resolve, reject) => {
    const PRODUCTS = getCollection('product')
    transaction(async (session) => {
      await PRODUCTS.updateOne({_id: new ObjectId(id)}, {$set: {isVerified: true}})
    })
    .then(result => resolve(true))
    .catch(err => reject(new RPErrImpossibleVerifyProduct(err)))
  })
}

export function addTags(id, newTags){
  return new Promise((resolve, reject) => {
    const PRODUCTS = getCollection('product')
    transaction(async (session) => {
      await PRODUCTS.updateOne({_id: new ObjectId(id)}, {$push: {tags: {$each: newTags}}}, {session})
    })
    .then(result => resolve(true))
    .catch(err => reject(new RPErrImpossibleAddTags(err)))
  })
}

export function deleteTags(id, oldTags){
  return new Promise((resolve, reject) => {
    const PRODUCTS = getCollection('product')
    transaction(async (session) => {
      await PRODUCTS.updateOne({_id: new ObjectId(id)}, {$pull: {tags: {$in: oldTags}}}, {session})
    })
    .then(result => resolve(true))
    .catch(err => reject(new RPErrImpossibleDeleteTags(err)))
  })
}

export function getFullProductsBySearch(search, tagsList){
  return new Promise((resolve, reject) => {
      const searchRegex = new RegExp(search, "i")
      const fieldsToSearch = [
        { "name": { $regex: searchRegex } },
        { "shortDescription": { $regex: searchRegex } },
        { "brand": { $regex: searchRegex } },
        { "versions.name": { $regex: searchRegex } },
        { "versions.longDescription": { $regex: searchRegex } },
        { "ownerRef": { $regex: searchRegex }}
      ]
      const query = {$match: {}}
      if(tagsList.length > 0){
        query.$match.$and = [
          { "tags": { $all: tagsList } },
          {
            $or: fieldsToSearch
          },
          { "isVerified": true}
        ]
      }else{
        query.$match.$and = [
          { "isVerified": true},
          {
            $or: fieldsToSearch
          }
        ]
      }
      getFullProductsByQuery(query)
      .then(collection => resolve(collection))
      .catch(err => reject(err))
  })
}

export function getFullProductsByUserId(userId){
  return new Promise((resolve, reject) => {
    const query = {$match: {$and: [
      {userId: userId},
      {isVerified: true}
    ]}}
    getFullProductsByQuery(query)
    .then(collection => resolve(collection))
    .catch(err => reject(new RPErrImpossibleFindByUserId(err)))
  })
}

export function insertFullProduct(product){
  return new Promise(async (resolve, reject) => {
    const PRODUCTS = getCollection('product')
    const VERSIONS = getCollection('version')
    const copyProduct = JSON.parse(JSON.stringify(product));
    const versions = copyProduct.versions;
    delete copyProduct.versions;
    let insertedId
    transaction(async (session) => {
      insertedId = (await PRODUCTS.insertOne(copyProduct, {session})).insertedId
      for(const version of versions){
        version.productId = insertedId
        await VERSIONS.insertOne(version, {session})
      }
    })
    .then(result => resolve(insertedId.toString()))
    .catch(err => reject(new RPErrImpossibleInsertFullProduct(err)))
  })
}

export function checkUserIdVersion(versionId, userId){
  return new Promise((resolve, reject) => {
    const query = {$match: {
      $and: [
        {"userId": userId},
        {"versions._id": new ObjectId(versionId)}
      ]
    }}
    getFullProductsByQuery(query)
    .then(products => {
      if(products.length > 0){
        resolve(true)
      }else{
        resolve(false)
      }
    })
    .catch(err => reject(err))
  })
}

export function checkUserIdProductId(productId, userId){
  return new Promise((resolve, reject) => {
    const query = {$match: {
      $and: [
        {"userId": userId},
        {"_id": new ObjectId(productId)}
      ]
    }}
    getFullProductsByQuery(query)
    .then(products => {
      if(products.length > 0){
        resolve(true)
      }else{
        resolve(false)
      }
    })
    .catch(err => reject(err))
  })
}

export function getUnverifiedProducts(){
  return new Promise((resolve, reject) => {
    const query = { $match: { isVerified: {$eq: false}}}
    getFullProductsByQuery(query)
    .then(products => resolve(products))
    .catch(err => reject(err))
  })
}

export function getProductsOfOwner(userId){
  return new Promise((resolve, reject) => {
    const query = { $match: { userId: {$eq: userId}}}
    getFullProductsByQuery(query)
    .then(products => resolve(products))
    .catch(err => reject(err))
  })
}