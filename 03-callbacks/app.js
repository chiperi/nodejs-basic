const fs = require("fs");
const path = require("path");
const parser = require("./parser");
const { filesDir, encoding } = require("./config");

function readFileProcess(file, callback) {
    const filePath = path.join(filesDir, file);

    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            callback(err);
            return;
        }

        const numbers = parser(file, data);

        const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        callback(null, sum);
    });
}


function processingFiles () {
    let totalSum = 0;
    fs.readdir(filesDir, (err, files) => {
        if (err || files.length === 0) {
            console.log('No numbers for calculating');
            return;
        }

        let filesProcessed = 0;

        files.forEach(file => {
            readFileProcess(file, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                totalSum += result;
                filesProcessed++;

                if (filesProcessed === files.length) {
                    console.log(`The sum of the numbers in the files: ${totalSum}`);
                }
            });
        });

    });

    
}

processingFiles();