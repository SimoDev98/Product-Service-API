export{RPErrProductNotFound, RPErrImpossibleUpdatePrice, RPErrImpossibleVerifyProduct, RPErrImpossibleAddTags, RPErrImpossibleDeleteTags, RPErrImpossibleUpdateAvailableUnits, RPErrImpossibleFindBySearch, RPErrImpossibleFindByUserId, RPErrImpossibleInsertFullProduct}
const RP_ERR_IMPOSSIBLE_TO_UPDATE_PRICE = '[REPOSITORY ERROR] It was impossible to update price.'
const RP_ERR_IMPOSSIBLE_TO_UPDATE_AVAILABLE_UNITS = '[REPOSITORY ERROR] It was impossible to update available units.'
const RP_ERR_IMPOSSIBLE_TO_VERIFY_PRODUCT = '[REPOSITORY ERROR] It was impossible to verify product.'
const RP_ERR_IMPOSSIBLE_TO_ADD_TAGS = '[REPOSITORY ERROR] It was impossible to add tags to product.'
const RP_ERR_IMPOSSIBLE_TO_DELETE_TAGS = '[REPOSITORY ERROR] It was impossible to delete tags from product.'
const RP_ERR_IMPOSSIBLE_FIND_BY_SEARCH = '[REPOSITORY ERROR] It was impossible to find products by search.'
const RP_ERR_IMPOSSIBLE_FIND_BY_USER_ID = '[REPOSITORY ERROR] It was impossible to find products by user id.'
const DB_ERR_IMPOSSIBLE_INSERT_FULL_PRODUCT = "[REPOSITORY ERROR] It was impossible to insert full product."
const RP_ERR_PRODUCT_NOT_FOUND = "[REPOSITORY ERROR] Product not found."

class RPErrProductNotFound extends Error{
    constructor(){
        super(RP_ERR_PRODUCT_NOT_FOUND)
        this.name = this.constructor.name
    }
}

class RPErrImpossibleUpdatePrice extends Error{
    constructor(message){
        super(RP_ERR_IMPOSSIBLE_TO_UPDATE_PRICE.concat(' : ').concat(message))
        this.name = this.constructor.name
    }
}

class RPErrImpossibleVerifyProduct extends Error{
    constructor(message){
        super(RP_ERR_IMPOSSIBLE_TO_VERIFY_PRODUCT.concat(' : ').concat(message))
        this.name = this.constructor.name
    }
}

class RPErrImpossibleAddTags extends Error{
    constructor(message){
        super(RP_ERR_IMPOSSIBLE_TO_ADD_TAGS.concat(' : ').concat(message))
        this.name = this.constructor.name
    }
}

class RPErrImpossibleDeleteTags extends Error{
    constructor(message){
        super(RP_ERR_IMPOSSIBLE_TO_DELETE_TAGS.concat(' : ').concat(message))
        this.name = this.constructor.name
    }
}

class RPErrImpossibleUpdateAvailableUnits extends Error{
    constructor(message){
        super(RP_ERR_IMPOSSIBLE_TO_UPDATE_AVAILABLE_UNITS.concat(' : ').concat(message))
        this.name = this.constructor.name
    }
}

class RPErrImpossibleFindBySearch extends Error{
    constructor(message){
        super(RP_ERR_IMPOSSIBLE_FIND_BY_SEARCH.concat(' : ').concat(message))
        this.name = this.constructor.name
    }
}

class RPErrImpossibleFindByUserId extends Error{
    constructor(message){
        super(RP_ERR_IMPOSSIBLE_FIND_BY_USER_ID.concat(' : ').concat(message))
        this.name = this.constructor.name
    }
}

class RPErrImpossibleInsertFullProduct extends Error{
    constructor(message){
        super(DB_ERR_IMPOSSIBLE_INSERT_FULL_PRODUCT.concat(' : ').concat(message))
        this.name = this.constructor.name
    }
}