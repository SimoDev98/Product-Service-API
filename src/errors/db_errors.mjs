export {DBErrConnection, DBErrDuplicatedConnection, DBErrNotConnected, DBErrInvalidCollectionName, DBErrTransactionFailed, DBErrInvalidJoinedCollectionArguments}

const DB_ERR_CONNECTION_FAILED = '[DATABASE ERROR] Database connection failed.'
const DB_ERR_DUPLICATED_CONNECTION = "[DATABASE ERROR] Cannot connect to database because it's already connected."
const DB_ERR_NOT_CONNECTED = "[DATABASE ERROR] Database is not connected."
const DB_ERR_INVALID_COLLECTION_NAME = "[DATABASE ERROR] Collection name is invalid."
const DB_ERR_TRANSACTION_FAILED = "[DATABASE ERROR] Transaction failed, no changes have been saved."
const DB_ERR_INVALID_JOINED_COLLECTION_ARGUMENTS = "[DATABASE ERROR] Invalid collection arguments."

class DBErrConnection extends Error {
    constructor(message) {
        super(DB_ERR_CONNECTION_FAILED.concat(" Message: ").concat(message))
        this.name = this.constructor.name
    }
}

class DBErrDuplicatedConnection extends Error {
    constructor() {
        super(DB_ERR_DUPLICATED_CONNECTION)
        this.name = this.constructor.name
    }
}

class DBErrNotConnected extends Error{
    constructor() {
        super(DB_ERR_NOT_CONNECTED)
        this.name = this.constructor.name
    }
}

class DBErrInvalidCollectionName extends Error{
    constructor() {
        super(DB_ERR_INVALID_COLLECTION_NAME.concat(" Message: ").concat(message))
        this.name = this.constructor.name
    }
}

class DBErrTransactionFailed extends Error{
    constructor(message) {
        super(DB_ERR_TRANSACTION_FAILED.concat(" Message: ").concat(message))
        this.name = this.constructor.name
    }
}

class DBErrInvalidJoinedCollectionArguments extends Error{
    constructor(message) {
        super(DB_ERR_INVALID_JOINED_COLLECTION_ARGUMENTS.concat(" Message: ").concat(message))
        this.name = this.constructor.name
    }
}