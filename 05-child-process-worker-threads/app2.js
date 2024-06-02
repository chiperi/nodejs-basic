const {Worker, isMainThread, workerData, parentPort} = require('worker_threads');


function workerFunction() {
    const {searchValue, arr, arrayNumber} = workerData;
    const indexOfElement = arr.indexOf(searchValue);
    if (indexOfElement > -1) {
        parentPort.postMessage({arrayNumber: arrayNumber+1, elementIndex: indexOfElement});
    } else {
        parentPort.postMessage(-1);
    }
};

function createWorker(searchValue,arr, arrayNumber) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, { workerData: {searchValue, arr, arrayNumber}});
        worker.on('message', message => resolve(message));
        worker.on('error', error => reject(error));
    });
}

function findElement(...data) {
    const [searchValue, ...arrays] = data.reverse();
    arrays.reverse();

    if(typeof searchValue !== 'string' || arrays.some(el => typeof el!== 'object')) {
        console.log('Invalid input');
        return;
    }

    if(isMainThread) {
        let workers = [];
        for (let i = 0; i < arrays.length; i++) {
            workers.push(createWorker(searchValue, arrays[i], i));
        }


        return Promise.all(workers).then(result => {
            result = result.filter(el => el!== -1);
            if (result.length === 0) {
                console.log('Element not found');
                return;
            }

            for ({elementIndex, arrayNumber} of result) {
                console.log(`Element found at index ${elementIndex} of array ${arrayNumber}`);
            }
        }).catch(err => {
            console.log(err);
        });
    } else {
        workerFunction();
    }
}


arr1 = ['dPRZxomA', '50aoPS1ZOu', 'TPGjTL8l', 'OlzF9pRSP'];
arr2 = ['0mHXAQJY6', 'mQueU006Is', 'cFM17Eou', 'pFUk0P3Ivo', 'Ob9NtLii', 'Jk8x5DBNxL'];
arr3 = ['dPRZxomA',  'TPGjTL8l', '50aoPS1ZOu'];
searchValue = '50aoPS1ZOu';
findElement(arr1, arr2, arr3, searchValue);