import {z} from 'zod'
import {versionModel} from './version-model.mjs'
import {isUserId} from '../helper/user_id_verifier.mjs'
const MAX_CHAR_NAME = 50, MAX_CHAR_SHOR_DESCRIPTION = 200,
MAX_CHAR_BRAND = 30, MAX_VERSIONS = 100, MAX_TAGS = 100
export {MAX_VERSIONS}

//Used for parse objects received throw endpoint "post product"
export const productModel = z.object({
    name: z.string()
        .min(1)
        .length()
        .max(MAX_CHAR_NAME),
    shortDescription: z.string()
        .min(1)
        .length()
        .max(MAX_CHAR_SHOR_DESCRIPTION),
    brand: z.string()
        .min(1)
        .length()
        .max(MAX_CHAR_BRAND),
    userId: z.string().refine(str => {return isUserId(str)}), //Id of owner
    versions: z.array(versionModel).min(1).max(MAX_VERSIONS),
    tags: z.array(
        z.string().refine(str => {
            const regex = /^[a-zA-Z0-9]{1,20}$/ //letters min masc and númbers. Min 1 char max 20 chars length.
            return regex.test(str)
        })
    )
    .min(1)
    .max(MAX_TAGS),
    ownerRef: z.optional(z.string())
})