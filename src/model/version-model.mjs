import {z} from 'zod'
const MAX_LENGHT_VERSION_NAME = 30, MAX_LONG_DESCRIPTION = 1000, MAX_CHAR_FILE_NAME = 100, MAX_NUM_FILE_NAME = 50
import { getVersionOfFile } from '../helper/filename-helper.mjs'
import { CURRENCY_LIST } from '../helper/currencies.mjs';

export const versionModel = z.object({
    name: z.string()
        .min(1)
        .length()
        .max(MAX_LENGHT_VERSION_NAME),
    price: z.number()
        .positive()
        .refine(value => {
            const partes = value.toString().split('.');
            if (partes.length === 1) return true;
            return partes[1].length <= 2;
            },
            {message: 'Price must have at most two decimal numbers'}
        ),
    currency: z.enum(CURRENCY_LIST),
    availableUnits: z.number()
        .int()
        .positive(),
    characteristics: z.record(z.string().max(20).or(z.number().or(z.boolean())))
        .refine(obj => {return Object.keys(obj).length > 0}, "Characteristics must have at least one field"),
    longDescription: z.optional(z.string()
        .length()
        .max(MAX_LONG_DESCRIPTION)),
    filesNames: z.array(z.string()
        .max(MAX_CHAR_FILE_NAME)
        .refine(fileName => {
                try{
                    getVersionOfFile(fileName) //Throw error if filename has wrong format or unauthorized extension
                    return true;
                }catch(err){
                    return false;
                }
            },
            {message: 'File extension not authorized'}
        )
    )
    .min(1)
    .max(MAX_NUM_FILE_NAME)
})