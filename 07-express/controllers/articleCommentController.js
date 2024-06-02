const { readArticlesSync, writeArticles } = require('../dev-data/utils');
const { statuses: STATUSES, statusMessages: STATUS_MESSAGES } = require('../config.json');

// Use readArticlesSync function to get articles
// Copy it to the functions below where articles are needed and remove from here
const articles = readArticlesSync();

exports.checkId = (request, response, next) => {
    // this middleware should check if comment with specified commentId exists
    // if it does - the next middleware should be called
    // if it does not - response status should be set to 404
    // and result should be json:
    // {
    //   status: 'fail'
    //   message: 'Invalid comment id',
    // }
    const commentId = +request.params.commentId;
    const comment = response.locals.foundArticle.comments.find((comm) =>  comm.id === commentId);
    if (comment === undefined) {
        return response.status(404).json({
            status: STATUSES[404],
            message: STATUS_MESSAGES.comments[404],
        });
    }
    response.locals.foundComment = comment;
    next();
};

exports.checkArticleComment = (request, response, next) => {
    // this middleware should check if comment in request body is correct
    // if it is - the next middleware should be called
    // if it is not - response status should be set to 400
    // and result should be json:
    // {
    //   status: 'fail'
    //   message: 'Content is required',
    // }
    const comment = request.body;

    if (!comment?.content) {
        return response.status(400).json({
            status: STATUSES[400],
            message: STATUS_MESSAGES.comments['400'],
        });
    }
    next();
};

exports.getAllArticleComments = (request, response) => {
    // response status should be 200
    // all comments of article with specified id should be provided
    // result should be json
    // {
    //   status: 'success',
    //   data: {
    //     count: comments count,
    //     comments: comments,
    //   },
    // }

    response.status(200).json({
        status: STATUSES[200],
        data: {
            count: response.locals.foundArticle.comments?.length,
            comments: response.locals.foundArticle.comments,
        },
    });
};

exports.getArticleComment = (request, response) => {
    // response status should be 200
    // comment of article should be provided
    // result should be json
    // {
    //   status: 'success',
    //   data: {
    //     comment: requested comment,
    //   },
    // }
    
    response.status(200).json({
        status: STATUSES[200],
        data: {
            comment: response.locals.foundComment,
        },
    });
};

exports.patchArticleComment = (request, response) => {
    // comment of article should be updated
    // response status should be 200
    // result should be json
    // {
    //   status: 'success',
    //   data: { comment: updatedComment }
    // }

    const commentToUpdate = response.locals.foundComment;
    const updatedComment = {
       ...commentToUpdate,
       ...request.body,
    };

    writeArticles(response.locals.articles, () => response.status(200).json({
        status: STATUSES[201],
        data: {
            comment: updatedComment,
        },
    }));
}

exports.postArticleComment = (request, response) => {
    // new comment should be added to the article
    // id should be evaluated as id of last comment of this article + 1
    // response status should be 201
    // result should be json
    // {
    //   status: 'success',
    //   data: { comment: newComment }
    // }

    response.locals.foundArticle.comments ??= [];

    const { comments } = response.locals.foundArticle;

    const newCommentId = comments[comments.length - 1].id + 1;
    const newComment = {
        id: newCommentId,
        ...request.body,
    };

    response.locals.foundArticle.comments.push(newComment);

    writeArticles(response.locals.articles, (err) => {
        if (err) {
            response.status(500).json({
                status: STATUSES[500],
                message: STATUS_MESSAGES.articles[500],
            });
        } else {
            response.status(201).json({
                status: STATUSES[201],
                data: {
                    comment: newComment,
                },
            });
        }
    });
};

exports.deleteArticleComment = (request, response) => {
    // comment with specified commentId should be deleted from the article comments
    // response status should be 200
    // result should be json
    // {
    //   status: 'success',
    //   data: { comment: null }
    // }

    response.locals.foundArticle.comments = response.locals.foundArticle.comments.filter((comment) => comment.id!== +request.params.commentId);

    writeArticles(response.locals.articles, (err) => {
        if (err) {
            response.status(500).json({
                status: STATUSES[500],
                message: STATUS_MESSAGES.articles[500],
            });
        } else {
            response.status(200).json({
                status: STATUSES[200],
                data: {
                    comment: null,
                },
            });
        }
    });
};
