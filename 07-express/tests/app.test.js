const request = require('supertest');
const articleController = require('../controllers/articleController');
const articleCommentController = require('../controllers/articleCommentController');

jest.mock('../controllers/articleController');
jest.mock('../controllers/articleCommentController');
jest.useFakeTimers('legacy');
const app = require('../app');

describe('/api/v1/articles/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('GET: articleController.checkId middleware is used and provides result if Id is not correct', async () => {
    const expected = {
      status: 'fail',
      message: 'Invalid article id',
    };
    const checkIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, res) => res.status(404).json(expected));
    const getArticleSpy = jest.spyOn(articleController, 'getArticle');

    const response = await request(app)
      .get('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(checkIdSpy).toHaveBeenCalledTimes(1);
    expect(getArticleSpy).toHaveBeenCalledTimes(0);
    expect(response.body).toEqual(expected);
  });

  it('GET: articleController.getArticle is called when id is correct', async () => {
    const expected = {
      id: 0,
      title: 'The Forest Hiker',
      description: 'Breathtaking hike through the Canadian Banff National Park',
      creationDate: '2021-04-25,10:00',
      editingDate: '2021-07-20,10:00',
    };

    const getArticleSpy = jest
      .spyOn(articleController, 'getArticle')
      .mockImplementationOnce((req, res) => res.status(200).json(expected));
    const checkIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((req, res, next) => {
        next();
      });
    const response = await request(app)
      .get('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(checkIdSpy).toHaveBeenCalledTimes(1);
    expect(getArticleSpy).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(expected);
  });

  it('PATCH: articleController.checkId middleware is used and provides result if Id is not correct', async () => {
    const expected = {
      status: 'fail',
      message: 'Invalid article id',
    };
    const checkIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, res) => res.status(404).json(expected));
    const patchArticleSpy = jest.spyOn(articleController, 'patchArticle');

    const response = await request(app)
      .patch('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(checkIdSpy).toHaveBeenCalledTimes(1);
    expect(patchArticleSpy).toHaveBeenCalledTimes(0);
    expect(response.body).toEqual(expected);
  });

  it('PATCH: articleController.patchArticle is called when id is correct', async () => {
    const expected = {
      id: 0,
      title: 'The Forest Hiker',
      description: 'Breathtaking hike through the Canadian Banff National Park',
      creationDate: '2021-04-25,10:00',
      editingDate: '2021-07-20,10:00',
    };

    const patchArticleSpy = jest
      .spyOn(articleController, 'patchArticle')
      .mockImplementationOnce((_, res) => res.status(200).json(expected));
    const checkIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const response = await request(app)
      .patch('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(checkIdSpy).toHaveBeenCalledTimes(1);
    expect(patchArticleSpy).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(expected);
  });

  it('DELETE: articleController.checkId middleware is used and provides result if Id is not correct', async () => {
    const expected = {
      status: 'fail',
      message: 'Invalid article id',
    };
    const checkIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, res) => res.status(404).json(expected));
    const patchArticleSpy = jest.spyOn(articleController, 'deleteArticle');

    const response = await request(app)
      .delete('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(checkIdSpy).toHaveBeenCalledTimes(1);
    expect(patchArticleSpy).toHaveBeenCalledTimes(0);
    expect(response.body).toEqual(expected);
  });

  it('DELETE: articleController.patchArticle is called when id is correct', async () => {
    const expected = {
      status: 'success',
      data: {
        article: null,
      },
    };

    const patchArticleSpy = jest
      .spyOn(articleController, 'deleteArticle')
      .mockImplementationOnce((_, res) => res.status(200).json(expected));
    const checkIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const response = await request(app)
      .delete('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(checkIdSpy).toHaveBeenCalledTimes(1);
    expect(patchArticleSpy).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(expected);
  });
});

describe('/api/v1/articles/', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET: articleController.getAllArticles is called and provides response', async () => {
    const expected = [
      {
        id: 0,
        title: 'The Forest Hiker',
      },
      {
        id: 1,
        title: 'The Sailor',
      },
    ];
    const getAllSpy = jest
      .spyOn(articleController, 'getAllArticles')
      .mockImplementationOnce((req, res) => res.status(200).json(expected));

    const response = await request(app)
      .get('/api/v1/articles')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(getAllSpy).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(expected);
  });

  it('POST: articleController.postArticle is called and provides response if article is correct', async () => {
    const expected = { status: 'success' };
    const checkArticleSpy = jest
      .spyOn(articleController, 'checkArticle')
      .mockImplementationOnce((req, res, next) => {
        next();
      });
    const postArticleSpy = jest
      .spyOn(articleController, 'postArticle')
      .mockImplementationOnce((req, res) => res.status(200).json(expected));

    const response = await request(app)
      .post('/api/v1/articles')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(checkArticleSpy).toHaveBeenCalledTimes(1);
    expect(postArticleSpy).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(expected);
  });
});

describe('/api/v1/articles/:id/comments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`GET: articleCommentController.getAllArticleComments and articleController.checkId 
  are called and provide response`, async () => {
    const expected = [
      {
        id: 0,
        content: 'comment 1',
      },
      {
        id: 1,
        content: 'comment 2',
      },
    ];
    const checkArticleIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const getAllCommentsSpy = jest
      .spyOn(articleCommentController, 'getAllArticleComments')
      .mockImplementationOnce((req, res) => res.status(200).json(expected));

    const response = await request(app)
      .get('/api/v1/articles/1/comments')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(checkArticleIdSpy).toHaveBeenCalledTimes(1);
    expect(getAllCommentsSpy).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(expected);
  });

  it(`POST: articleCommentController.getAllArticleComments,
  articleCommentController.getAllArticleComments and articleController.checkId
  are called and provide response if comment and ids are correct`, async () => {
    const expected = { status: 'success' };
    const checkArticleIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const checkCommentSpy = jest
      .spyOn(articleCommentController, 'checkArticleComment')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const postArticleCommentSpy = jest
      .spyOn(articleCommentController, 'postArticleComment')
      .mockImplementationOnce((_, res) => res.status(200).json(expected));

    const response = await request(app)
      .post('/api/v1/articles/1/comments')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(checkArticleIdSpy).toHaveBeenCalledTimes(1);
    expect(checkCommentSpy).toHaveBeenCalledTimes(1);
    expect(postArticleCommentSpy).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(expected);
  });

  it(`POST: articleController.checkId
  provide response if comment is not correct`, async () => {
    const expected = { status: 'fail' };
    const checkArticleIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const checkCommentSpy = jest
      .spyOn(articleCommentController, 'checkArticleComment')
      .mockImplementationOnce((_, res) => res.status(404).json(expected));
    const postArticleCommentSpy = jest
      .spyOn(articleCommentController, 'postArticleComment')
      .mockImplementationOnce((_, res) => res.status(200).json(expected));

    const response = await request(app)
      .post('/api/v1/articles/1/comments')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(checkArticleIdSpy).toHaveBeenCalledTimes(1);
    expect(checkCommentSpy).toHaveBeenCalledTimes(1);
    expect(postArticleCommentSpy).toHaveBeenCalledTimes(0);
    expect(response.body).toEqual(expected);
  });
});

describe('/api/v1/articles/:id/comments/:commentId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`GET: articleCommentController.getArticleComment and articleController.checkId 
  are called and provide response`, async () => {
    const expected = {
      id: 0,
      content: 'comment 1',
    };
    const checkArticleIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const checkArticleCommentIdSpy = jest
      .spyOn(articleCommentController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const getCommentSpy = jest
      .spyOn(articleCommentController, 'getArticleComment')
      .mockImplementationOnce((req, res) => res.status(200).json(expected));

    const response = await request(app)
      .get('/api/v1/articles/1/comments/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(checkArticleIdSpy).toHaveBeenCalledTimes(1);
    expect(checkArticleCommentIdSpy).toHaveBeenCalledTimes(1);
    expect(getCommentSpy).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(expected);
  });

  it(`DELETE: articleCommentController.deleteArticleComment, articleCommentController.deleteArticleCommentId
    and articleController.checkId are called and provide response`, async () => {
    const expected = {
      status: 'fail',
      message: 'Invalid article id',
    };
    const checkArticleIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const checkArticleCommentIdSpy = jest
      .spyOn(articleCommentController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const getCommentSpy = jest
      .spyOn(articleCommentController, 'deleteArticleComment')
      .mockImplementationOnce((req, res) => res.status(200).json(expected));

    const response = await request(app)
      .delete('/api/v1/articles/1/comments/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(checkArticleIdSpy).toHaveBeenCalledTimes(1);
    expect(checkArticleCommentIdSpy).toHaveBeenCalledTimes(1);
    expect(getCommentSpy).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(expected);
  });

  it(`GET: articleCommentController.checkId middleware is used and provides result 
  if comment Id is not correct`, async () => {
    const expected = {
      status: 'fail',
      message: 'Invalid comment id',
    };
    const checkArticleIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const checkArticleCommentIdSpy = jest
      .spyOn(articleCommentController, 'checkId')
      .mockImplementationOnce((_, res) => res.status(404).json(expected));
    const getCommentSpy = jest.spyOn(
      articleCommentController,
      'getArticleComment'
    );

    const response = await request(app)
      .get('/api/v1/articles/1/comments/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(checkArticleIdSpy).toHaveBeenCalledTimes(1);
    expect(checkArticleCommentIdSpy).toHaveBeenCalledTimes(1);
    expect(getCommentSpy).toHaveBeenCalledTimes(0);
    expect(response.body).toEqual(expected);
  });

  it(`DELETE: articleCommentController.deleteArticleComment, articleCommentController.deleteArticleCommentId
    and articleController.checkId are called and provide response`, async () => {
    const expected = {
      status: 'fail',
      message: 'Invalid comment id',
    };
    const checkArticleIdSpy = jest
      .spyOn(articleController, 'checkId')
      .mockImplementationOnce((_, __, next) => {
        next();
      });
    const checkArticleCommentIdSpy = jest
      .spyOn(articleCommentController, 'checkId')
      .mockImplementationOnce((_, res) => res.status(404).json(expected));
    const getCommentSpy = jest
      .spyOn(articleCommentController, 'deleteArticleComment')
      .mockImplementationOnce((req, res) => res.status(404).json(expected));

    const response = await request(app)
      .delete('/api/v1/articles/1/comments/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(checkArticleIdSpy).toHaveBeenCalledTimes(1);
    expect(checkArticleCommentIdSpy).toHaveBeenCalledTimes(1);
    expect(getCommentSpy).toHaveBeenCalledTimes(0);
    expect(response.body).toEqual(expected);
  });
});
