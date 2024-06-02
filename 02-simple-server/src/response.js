const response = () => {
    return {
        generateResponse: (res, status = 400, data = 'Operation unknown') => {
            res.writeHead(status, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    }
}

module.exports = response;