const fs = require('fs');
const { statuses: STATUSES } = require('../config.json');

const articlesFilePath = `${__dirname}/articles-simple.json`;

exports.readArticlesSync = () => JSON.parse(fs.readFileSync(articlesFilePath));

exports.writeArticles = (articles, callback) => {
  fs.writeFile(articlesFilePath, JSON.stringify(articles), callback);
};

exports.createResponse = (response, status, data) => {
  const config = {};

  config.status = STATUSES[status];

  if ((status === 200 || status === 201) && typeof data === 'object')
    config.data = {
      count: data.length || 0,
      articles: data,
    };

  if ((status === 400 || status === 404) && typeof data === 'string') {
    config.message = data;
  }

  response.status(status).json({
    ...config,
  });
};
