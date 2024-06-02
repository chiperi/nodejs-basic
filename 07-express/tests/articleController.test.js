require('jest-chain');

jest.mock('fs');
const testArticles = [
  {
    id: 0,
    title: 'The Coastal Explorer',
    description: 'Discover stunning coastal landscapes on a hiking adventure',
  },
  {
    id: 1,
    title: 'The Mountain Trekker',
    description:
      'Experience the rugged beauty of the Rocky Mountains on an unforgettable hike',
  },
];
jest.mock('../dev-data/utils', () => ({
  readArticlesSync() {
    return [...testArticles];
  },
  writeArticles(_, callback) {
    callback();
  },
}));

const controller = require('../controllers/articleController');

describe('articleController', () => {
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

  it('deleteArticle sets response status 200 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();

    controller.checkId(req, res, jest.fn());
    controller.deleteArticle(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(200);
    expect(res.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          article: null,
        },
      });
  });

  it('patchArticle sets response status 200 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();

    req.body = {
      description: 'article description here',
    };
    controller.checkId(req, res, jest.fn());
    controller.patchArticle(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(200);
    expect(res.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          article: {
            id: 1,
            title: 'The Mountain Trekker',
            description: 'article description here',
          },
        },
      });
  });

  it('postArticle sets response status 201 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();
    const newArticle = {
      title: 'New article',
      description: 'article description here',
    };
    req.body = newArticle;

    controller.postArticle(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(201);
    expect(res.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          article: { id: 2, ...newArticle },
        },
      });
  });

  it('getArticle sets response status 200 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();

    controller.checkId(req, res, jest.fn());
    controller.getArticle(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(200);
    expect(res.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          article: testArticles[req.params.id],
        },
      });
  });

  it('getAllArticles sets response status 200 and sets correct json result', () => {
    const req = mockRequest();
    const res = mockResponse();
    req.query = {};

    controller.getAllArticles(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(200);
    expect(res.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          count: testArticles.length,
          articles: testArticles,
        },
      });
  });

  it(`getAllArticles with filter query param 
  sets response status 200 and sets filtered json result`, () => {
    const req = mockRequest();
    const res = mockResponse();
    req.query = { title: 'Mou' };

    controller.getAllArticles(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(200);
    expect(res.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          count: 1,
          articles: [testArticles[1]],
        },
      });
  });

  it(`checkId sets response status 404 and sets correct json result 
  if entity with specified id is not found`, () => {
    const req = mockRequest();
    const res = mockResponse();

    req.params.id = -1;
    controller.checkId(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid article id',
    });
  });

  it(`checkId calls the next middleware if entity with specified id is found`, () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();

    controller.checkId(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(0);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it(`checkArticle sets response status 400 and sets correct json result 
  if article is not correct`, () => {
    const req = mockRequest();
    const res = mockResponse();

    req.body = {
      description: 'article description here',
    };

    controller.checkArticle(req, res);

    expect(res.status).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Title is required',
    });
  });

  it(`checkArticle calls the next middleware if entity with specified id is found`, () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    req.body = {
      title: 'New article',
      description: 'article description here',
    };

    controller.checkArticle(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(0);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
