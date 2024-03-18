export {CTErrWrongFormatProduct, CTErrInsertingProduct, CTErrWrongFilesFormat, CTErrBadRequest, CTErrNotAuthorized, CTErrNotAvailable, CTErrInternalServerError, CTErrImpossibleVerifyProduct}

const CT_PRODUCT_WRONG_FORMAT = "[ERROR MESSAGE FOR CLIENT] Cannot insert new product because product has wrong format. Check the following details"
const CT_PRODUCT_ERROR_INSERTING = "[ERROR MESSAGE FOR CLIENT] An error has ocurred while inserting the product"
const CT_PRODUCT_WRONG_FILES_FORMAT = "[ERROR MESSAGE FOR CLIENT] Files have wrong format. Check the following details."
const CT_BADREQUEST = "[ERROR MESSAGE FOR CLIENT] Request does not meet the requirements."
const CT_NOT_AUTHORIZED = "[MESSAGE FOR CLIENT] Not authorized."
const CT_INTERNAL_SERVER_ERROR = '[MESSAGE FOR CLIENT] It was impossible to complete operation because of internal server error'
const CT_NOT_AVAILABLE = "[MESSAGE FOR CLIENT] There are no products according to this filter."
const CT_IMPOSSIBLE_VERIFY_PRODUCT = '[MESSAGE FOR CLIENT] It was impossible to verify the product.'

class CTErrWrongFormatProduct extends Error{
    constructor(message){
        super(CT_PRODUCT_WRONG_FORMAT.concat(' : ').concat(message)),
        this.name = this.constructor.name
    }
}

class CTErrInsertingProduct extends Error{
    constructor(){
        super(CT_PRODUCT_ERROR_INSERTING),
        this.name = this.constructor.name
    }
}

class CTErrWrongFilesFormat extends Error{
    constructor(message){
        super(CT_PRODUCT_WRONG_FILES_FORMAT.concat(' : ').concat(message)),
        this.name = this.constructor.name
    }
}

class CTErrBadRequest extends Error{
    constructor(){
        super(CT_BADREQUEST),
        this.name = this.constructor.name
    }
}

class CTErrNotAuthorized extends Error{
    constructor(){
        super(CT_NOT_AUTHORIZED),
        this.name = this.constructor.name
    }
}

class CTErrInternalServerError extends Error{
    constructor(){
        super(CT_INTERNAL_SERVER_ERROR),
        this.name = this.constructor.name
    }
}

class CTErrNotAvailable extends Error{
    constructor(){
        super(CT_NOT_AVAILABLE),
        this.name = this.constructor.name
    }
}

class CTErrImpossibleVerifyProduct extends Error{
    constructor(){
        super(CT_IMPOSSIBLE_VERIFY_PRODUCT),
        this.name = this.constructor.name
    }
}

