## The task of the topic "express"

Create a web application using Node.js and Express.js that allows users to create, read, update, and delete articles.  
Also, the application should allow users to add and delete comment to specific article, and see all comments that belong to specific article.

Article has id, title, description and comments properties.

Use '/api/v1/articles' as root url for articles. Then '/api/v1/articles/:id' should be used for requests that require id of article.  
Use '/api/v1/articles/:id/comments' as root url for comments of specific article. Then '/api/v1/articles/:id/comments/:commentId' should be used for requests that require id of comment.  
Create seperate routers for each of those two resources and place them in routes folder in articleRoutes and articleCommentRouter files correspondingly.  
Connect routers to application object app in app.js  
Create article handlers in articleController.js and articleCommentController.js, all the names of required handlers are specified there along with expected responses.  
Create middlewares in articleController and articleCommentController for checking correctness of Id of article/comment that is requested/updated/deleted. If entity with such id does not exist, the response should be provided with status 404 and body

```
  {
    status: 'fail',
    message: 'Invalid article id',
  }
```

or

```
 {
   status: 'fail',
   message: 'Invalid comment id',
 }
```

Create middleware checkArticle for checking correctness of body of request for creating article. Non-empty _title_ property must be present. If this property is not provided, or it is empty, the response should be provided with status 400 and body

```
  {
    status: 'fail',
    message: 'Title is required',
  }
```

Create middleware checkComment for checking correctness of body of request for creating comment. Non-empty _content_ property must be present. If this property is not provided, or it is empty, the response should be provided with status 400 and body

```
  {
    status: 'fail',
    message: 'Content is required',
  }
```

<br><br>
_Please, set all response status codes explicitly_
