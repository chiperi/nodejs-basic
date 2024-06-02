const HTTP = require('http');
const URL = require('url');

const response = require('./response')();
const calculator = require('./calculator')();
const fileSystem = require('./file-system')();

const OPERATIONS_CALCULATOR = ['add','sub','mul', 'div'];
const OPERATIONS_FILE = ['read','create'];

const app = HTTP.createServer(({url}, res) => {
    const {pathname, query} = URL.parse(url, true);
    const {operation, a, b, filename, text} = query;
    const CALC_CONDITION = OPERATIONS_CALCULATOR.indexOf(operation) > -1 & typeof +a == 'number' & typeof +b == 'number';
    const FILE_CONDITION = OPERATIONS_FILE.indexOf(operation) > -1 & typeof filename =='string';

    if (pathname == '/calc' && CALC_CONDITION) {
        response.generateResponse(res, 200, `${calculator[operation](+a, +b)}`);
    }
    else if (pathname == '/fs' && FILE_CONDITION) {
        response.generateResponse(res, 201, fileSystem[operation](filename, text));
    }        
    else {
        response.generateResponse(res);
    }       

});

module.exports = app;