const express = require('express');
const {
    checkId,
    checkArticleComment,
    getAllArticleComments,
    postArticleComment,
    getArticleComment,
    deleteArticleComment,
    patchArticleComment,
} = require('../controllers/articleCommentController');
const { checkId: checkArticleId } = require('../controllers/articleController');

//define routes for article comments here (for get, post and delete requests)
//use exspress Router
//articleController.checkId should be called before every route
//articleCommentController.checkId should be called before getArticleComment and deleteArticleComment
//articleCommentController.checkArticleComment should be called before postArticleComment

const router = express.Router({ mergeParams: true });

router.use(checkArticleId);

router.route('/').get(getAllArticleComments).post(checkArticleComment, postArticleComment);
router.route('/:commentId').all(checkId).get(getArticleComment).patch(patchArticleComment).delete(deleteArticleComment);

module.exports = router;
