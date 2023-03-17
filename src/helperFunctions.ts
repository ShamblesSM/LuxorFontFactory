export function getImagePath(imagename: String, usePng: boolean, mat: number) {
    if (usePng) return `~data/textures/fonts/${imagename}_${mat}.png`;
    else
        return `~data/textures/fonts/${imagename}_${mat}.jpg*data/textures/fonts/${imagename}_${mat}_alpha.tga`;
}

export function getCharacterString(char: number) {
    let parsedChar = String.fromCharCode(char)
    switch (parsedChar) {
        case "\\": return `"\\\\"`
        case `"`: return `"\\"\"`
        case `'`: return `"\\'"`
        default: return `"${parsedChar}"`
    }
}