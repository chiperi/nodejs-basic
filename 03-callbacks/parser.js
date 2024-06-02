const { filesDir, supportedFileTypes } = require("./config");

function extractNumbersToArray(str) {
    const numbersArray = str.split(/\D+/);
    return  numbersArray.filter(num => num !== "").map(Number);
}


const getFileFormat = (file) => {
    const partsArray = file.split(".");
    return partsArray[partsArray.length - 1];
}

const parser = (file, data) => {
    const fileFormat = getFileFormat(file);
    const fileIsSupported = supportedFileTypes.some(format => fileFormat.toLowerCase().endsWith(format));
    
    if ( !fileIsSupported ) {
        console.log(`App doesn't support this file format: ${filesDir}/${file}`);
    } else {
        return extractNumbersToArray(data)
    }
};

module.exports = parser;