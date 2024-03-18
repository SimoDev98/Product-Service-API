export {DisableServerError, EnableServerError, ClientCertificateValidationError}

const DISABLE_SERVER_ERROR = '[SERVER ERROR] It has not been possible to close the server'
const ENABLE_SERVER_ERROR = '[SERVER ERROR] Cannot enable server'
const CLIENT_CERTIFICATE_VALIDATION_ERROR = '[SERVER ERROR] An error ocurred during client certificate validation'

class DisableServerError extends Error {
    constructor(message){
        super(DISABLE_SERVER_ERROR + message)
        this.name = this.constructor.name
    }
}

class EnableServerError extends Error {
    constructor(message){
        super(ENABLE_SERVER_ERROR + message)
        this.name = this.constructor.name
    }
}

class ClientCertificateValidationError extends Error {
    constructor(message){
        super(CLIENT_CERTIFICATE_VALIDATION_ERROR + message)
        this.name = this.constructor.name
    }
}