const fs = require('node:fs');
const readline = require('node:readline');
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads'); 

const positionColumn = 'Job Title', idColumn = 'ID';
const searchValue = 'Developer';
let positionColumnIndex = undefined, idColumnIndex = undefined;


if (isMainThread) {
    const workerScript = new Worker(__filename, { workerData: 'example.csv' });
    workerScript.on('message', message => message.forEach(element => {
        console.log(element);
    }));
} else {
    parseCSV(workerData);
}


function parseCSV(fileUrl) {
    parentPort.on('message', (message) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(fileUrl),
            crlfDelay: Infinity
        });
    
        let isFirstLine = true;
        let ids = [];
    
        rl.on('line', (line) => {
            const arr = line.split(',');
    
            if (isFirstLine) {
                positionColumnIndex = arr.indexOf(positionColumn);
                idColumnIndex = arr.indexOf(idColumn);
                isFirstLine = false;
            } else {
                if (arr[positionColumnIndex]?.includes(searchValue)) {
                    ids.push(arr[idColumnIndex]);
                }
            }
        });
    
        rl.on('close', () => {
            ids.sort();
            parentPort.postMessage(ids);
        });
    })
}