const AUTHORIZED_EXTENSIONS = process.env.AUTHORIZED_EXTENSIONS.split(',')

//Returns the version number from a file name
export function getVersionOfFile(fileName){
    for(let i = 0; i < AUTHORIZED_EXTENSIONS.length; i++){
        const regexTest = new RegExp(`version-(\\d+)${AUTHORIZED_EXTENSIONS[i]}$`);
        if(regexTest.test(fileName)){
            const regex = /version-(\d+)/
            const match = fileName.match(regex)
            if(match){
                const version = parseInt(match[1])
                return version
            }else{
                throw new Error("Incorrect file name format or unauthorized extension. Value:" + fileName)
            }
        }
    }
    throw new Error("Incorrect file name format or unauthorized extension. Value:" + fileName)
}

/*
//PATERN
const a = 'picture1version-58.jpg' //Correct
const b = 'asdfasversion-58.pdf' //Incorrect not authorized pdf
const c = 'asdfasdversion-.jpg' //Incorrect haven't version num
const d = 'version-2asd.jpg' //Incorrect doesn't end with version-numberOfVersion+extension.
*/