const fs = require('fs');

const errorHandler = (err) => {
    if (err) {
        console.error(err);
    }
}

const fileSystem = () => {
    return {
        read: (filename) => fs.readFileSync(filename, 'utf-8'),
        create: (filename, text) => {
            fs.writeFileSync(filename, text, 'utf-8', errorHandler);
            return `${filename} was created`;
        }
    }
}

module.exports = fileSystem;