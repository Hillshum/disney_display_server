import confusables from './confusables.json';


const replacementMap = new Map<string, string>(Object.entries(confusables));
console.log(replacementMap.get(' '))

const replaceWithMap = (x: string) => {
    if (x.codePointAt(0) > 127) {
        return replacementMap.get(x) ?? x;
    }
    return x;
}


const regex = /[^A-Za-z0-9]/g

const forceStringToAscii = (str: string) => {
    return str.normalize('NFC').replace(regex, replaceWithMap )
}

export default forceStringToAscii;