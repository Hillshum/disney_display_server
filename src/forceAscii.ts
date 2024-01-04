import confusables from './confusables.json';


const replacementMap = new Map<string, string>(Object.entries(confusables));
console.log(replacementMap.get(' '))

const replaceWithMap = (x: string) => {
    // only an empty string or something else bizzare would not have a codepoint
    // not really expecting this to be called with an empty string
    // because that's how regex works, but to keep typescript happy
    // we'll check for it
    if (x.codePointAt(0) ?? 0 > 127) {
        return replacementMap.get(x) ?? x;
    }
    return x;
}


const regex = /[^A-Za-z0-9]/g

const forceStringToAscii = (str: string) => {
    return str.normalize('NFC').replace(regex, replaceWithMap )
}

export default forceStringToAscii;