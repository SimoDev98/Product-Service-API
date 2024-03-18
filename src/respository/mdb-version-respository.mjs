import { ObjectId } from "mongodb"
import { getCollection, transaction } from "../database/mongodb-config.mjs"
import { RPErrImpossibleUpdatePrice, RPErrImpossibleUpdateAvailableUnits } from "../errors/repository_errors.mjs"

export function updateVersionPrice(versionId, newPrice){
    return new Promise((resolve, reject) => {
        const VERSIONS = getCollection('version')
        transaction(async (sessions) => {
            await VERSIONS.updateOne({_id: new ObjectId(versionId)}, {$set: {price: newPrice}}, {sessions})
        })
        .then(result => resolve(true))
        .catch(err => reject(new RPErrImpossibleUpdatePrice(err)))
    })
}

export function updateAvailableUnits(versionId, newAvailableUnits){
    return new Promise((resolve, reject) => {
        const VERSIONS = getCollection('version')
        transaction(async (sessions) => {
            await VERSIONS.updateOne({_id: new ObjectId(versionId)}, {$set: {availableUnits: newAvailableUnits}}, {sessions})
        })
        .then(result => resolve(true))
        .catch(err => reject(new RPErrImpossibleUpdateAvailableUnits(err)))
    })
}