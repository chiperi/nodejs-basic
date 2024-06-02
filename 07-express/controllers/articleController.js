const { readArticlesSync, writeArticles } = require('../dev-data/utils');
const { statuses: STATUSES, statusMessages: STATUS_MESSAGES } = require('../config.json');

// Use readArticlesSync function to get articles
// Copy it to the functions below where articles are needed and remove from here

exports.checkId = (request, response, next) => {
    // this middleware should check if article with specified commentId exists
    // if it does - the next middleware should be called
    // if it does not - response status should be set to 404
    // and result should be json:
    // {
    //   status: 'fail',
    //   message: 'Invalid article id',
    // }

    response.locals.articles = readArticlesSync();
    const id = +request.params.id;

    const article = response.locals.articles.find((articleData) => articleData.id === id);
    if (!article) {
        return response.status(404).json({
            status: STATUSES[404],
            message: STATUS_MESSAGES.article[404],
        });
    }

    response.locals.foundArticle = article;

    next();
};

exports.checkArticle = (request, response, next) => {
    // this middleware should check if article in request body is correct
    // if it is - the next middleware should be called
    // if it is not - response status should be set to 400
    // and result should be json:
    // {
    //   status: 'fail'
    //   message: 'Title is required',
    // }

    const article = request.body;
    if (!article.title) {
        return response.status(400).json({
            status: STATUSES[400],
            message: STATUS_MESSAGES.article['400_1'],
        });
    }
    next();
};

exports.getAllArticles = (request, response) => {
    // response status should be 200
    // all articles should be provided
    // if title is present in query params,
    // only those articles that contain it (case insensitive), should be provided
    // result should be json
    // {
    //   status: 'success',
    //   data: {
    //     count: articles count,
    //     articles: all articles,
    //   },
    // }

    const articles = readArticlesSync();
    const returnArticles = request.query.title
        ? articles.filter((article) => article.title.toLowerCase().includes(request.query.title.toLowerCase()))
        : articles;

    response.status(200).json({
        status: STATUSES[200],
        data: {
            count: returnArticles.length,
            articles: returnArticles,
        },
    });
};

exports.getArticle = (request, response) => {
    // response status should be 200
    // article with requested id should be provided
    // result should be json
    // {
    //   status: 'success',
    //   data: {
    //     article: found article,
    //   },
    // }
    const articles = readArticlesSync();
    const article = articles.filter((element) => String(element.id) === String(request.params.id));

    if (!article || article.length < 1) {
        response.status(404).json({
            status: STATUSES[404],
            message: STATUS_MESSAGES.articles[404],
        });
    } else {
        response.status(200).json({
            status: STATUSES[200],
            data: {
                article: article[0],
            },
        });
    }
};

exports.postArticle = (request, response) => {
    // new article should be added
    // id should be evaluated as id of last article + 1
    // response status should be 201
    // result should be json
    // {
    //   status: 'success',
    //   data: { article: newarticle }
    // }

    const articles = readArticlesSync();
    const newId = articles[articles.length - 1].id + 1;
    const newArticle = {
        id: newId,
        ...request.body,
    };
    articles.push(newArticle);
    writeArticles(articles, () => {
        response.status(201).json({
            status: STATUSES[200],
            data: { article: newArticle },
        });
    });
};

exports.patchArticle = (request, response) => {
    // article with specified id should be updated
    // (only properties provided in body should be overwritten in existing article)
    // response status should be 200
    // result should be json
    // {
    //   status: 'success',
    //   data: { article: updated article }
    // }

    Object.assign(response.locals.foundArticle, request.body);
    writeArticles(response.locals.articles, () => {
        response.status(200).json({
            status: STATUSES[200],
            data: { article: response.locals.foundArticle },
        });
    });
};

exports.deleteArticle = (request, response) => {
    // article with specified id should be deleted
    // response status should be 200
    // result should be json
    // {
    //   status: 'success',
    //   data: { article: null }
    // }

    writeArticles(
        response.locals.articles.filter((el) => el.id !== response.locals.article),
        () => {
            response.status(200).json({
                status: STATUSES[200],
                data: { article: null },
            });
        }
    );
};
