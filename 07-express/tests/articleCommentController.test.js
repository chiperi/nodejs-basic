require('jest-chain');

jest.mock('fs');
const testArticles = [
  {
    id: 0,
    title: 'The Coastal Explorer',
    description: 'Discover stunning coastal landscapes on a hiking adventure',
    comments: [],
  },
  {
    id: 1,
    title: 'The Mountain Trekker',
    description:
      'Experience the rugged beauty of the Rocky Mountains on an unforgettable hike',
    comments: [
      {
        id: 0,
        content: 'comment 1',
      },
      {
        id: 1,
        content: 'comment 2',
      },
    ],
  },
];
jest.mock('../dev-data/utils', () => ({
  readArticlesSync() {
    return testArticles;
  },
  writeArticles(_, callback) {
    callback();
  },
}));

const controller = require('../controllers/articleCommentController');
const articleController = require('../controllers/articleController');

describe('articleCommentController', () => {
  const mockRequest = () => ({
    params: { id: 1 },
  });
  const mockResponse = () => {
    const res = {};
    res.locals = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockImplementation(() => res);
    return res;
  };

  it('getAllArticleComments sets response status 200 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();
    req.query = {};

    articleController.checkId(req, res, jest.fn());
    controller.getAllArticleComments(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(200);
    expect(res.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          count: testArticles[req.params.id].comments.length,
          comments: testArticles[req.params.id].comments,
        },
      });
  });

  it('getArticleComment sets response status 200 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();
    req.query = {};
    req.params.commentId = 0;

    articleController.checkId(req, res, jest.fn());
    controller.checkId(req, res, jest.fn());
    controller.getArticleComment(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(200);
    expect(res.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          comment: testArticles[req.params.id].comments[req.params.commentId],
        },
      });
  });

  it('postArticleComment sets response status 201 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();
    const newComment = {
      content: 'New comment',
    };
    req.body = newComment;

    articleController.checkId(req, res, jest.fn());
    controller.checkArticleComment(req, res, jest.fn());
    controller.postArticleComment(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(201);
    expect(res.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          comment: { id: 2, ...newComment },
        },
      });
  });

  it('deleteArticleComment sets response status 200 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();
    req.query = {};
    req.params.commentId = 0;

    articleController.checkId(req, res, jest.fn());
    controller.checkId(req, res, jest.fn());
    controller.deleteArticleComment(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(200);
    expect(res.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          comment: null,
        },
      });
  });

  it('checkId sets response status 404 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();
    req.query = {};
    req.params.commentId = 5;
    const expected = {
      status: 'fail',
      message: 'Invalid comment id',
    };

    articleController.checkId(req, res, jest.fn());
    controller.checkId(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expected);
  });

  it('checkArticleComment sets response status 400 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();
    req.query = {};
    req.body = {};
    req.params.commentId = 1;
    const expected = {
      status: 'fail',
      message: 'Content is required',
    };

    articleController.checkId(req, res, jest.fn());
    controller.checkId(req, res, jest.fn());
    controller.checkArticleComment(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expected);
  });

  it('checkArticleComment calls next middleware if comment is correct', () => {
    const req = mockRequest();
    const res = mockResponse();
    req.query = {};
    const newComment = {
      content: 'New comment',
    };
    req.body = newComment;
    const nextSpy = jest.fn();

    articleController.checkId(req, res, jest.fn());
    controller.checkArticleComment(req, res, nextSpy);

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(0);
    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
