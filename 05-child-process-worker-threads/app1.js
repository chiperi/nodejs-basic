function foldersGenerator (folderName, folderCount) {
    if (typeof folderName!== "string" || typeof folderCount !== "number") {
        return new Error("Invalid input");
    }

    const {exec} = require('child_process');
    
    for (let i = 0; i < folderCount; i++) {
        exec(`mkdir ${folderName}${i+1}`, (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
}

foldersGenerator ('demo', 3);