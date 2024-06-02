const express = require('express');
const { checkId, checkArticle, getAllArticles, postArticle, getArticle, patchArticle, deleteArticle } = require('../controllers/articleController');

//define routes for articles here (for get, post, patch and delete requests)
//use exspress Router
//articleController.checkArticle should be called before articleController.postArticle
//articleController.checkId should be called first for routes with id parameter

const router = express.Router();

// router.use('/', (req, res, next) => checkArticle(req, res, next));
router.route('/').get(getAllArticles).post(checkArticle, postArticle);

router.route('/:id').all(checkId).get(getArticle).patch(patchArticle).delete(deleteArticle);

module.exports = router;
