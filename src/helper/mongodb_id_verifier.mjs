export function isMongodbIdHexadecimal(str) {
    const regex = /^[0-9a-fA-F]{24}$/
    return regex.test(str)
}