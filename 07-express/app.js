const express = require('express');
const { apiUrl } = require('./config.json');
const articleRouter = require('./routes/articleRoutes');
const articleCommentRouter = require('./routes/articleCommentRouter');

const app = express();

app.use(express.json());

// app should use articleCommentRouter and articleRouter routers
app.use(`${apiUrl}articles`, articleRouter);
articleRouter.use(`/:id/comments`, articleCommentRouter);

module.exports = app;
