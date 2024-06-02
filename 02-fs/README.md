## Description

  
- An HTTP server is created using the `http.createServer()` method in `./src/app.js`.

- The server listens for requests from clients in `./index.js`.

- Requests are processed based on the request path (`q.pathname`).

- If the request path is `/calc`, the calculator operation is performed.

  - The operation parameters, `operation`, `a`, and `b`, are extracted from the request (`q.query`).

  - Depending on the operation (`operation`), addition(`add`), subtraction(`sub`), multiplication(`mul`), or division(`div`) of numbers `a` and `b` is performed.

  - The response (operation result) is sent to the client with a status code of `200`.

- If the request path is `/fs`, the file handling operation is performed.

  - The operation parameters, `operation`, `filename`, and `text`, are extracted from the request (`q.query`).

  - Depending on the operation (`operation`), either a file is created or data is read from a file.

  - The response (operation result) is sent to the client with a status code of `201`.

- If the request path does not match `/calc` or `/fs`, the server responds with `"Operation unknown"` and a status code of `400`.

- The server's response sets the `Content-Type` header to `text/html`.

- The server's response is sent to the client with the content (operation result or error message).

- The web server is exported for use in other modules using `module.exports`.

  

## Functional examples

| **Request** | **Response : Status** | **Response : Text** |
|--|--|--|
| /calc?operation=add&a=2&b=3 | 200 | 5 |
| /calc?operation=add&a=-22&b=3 | 200 | -19 |
| /calc?operation=sub&a=2&b=3 | 200 | -1 |
| /calc?operation=sub&a=2&b=0 | 200 | 2 |
| /calc?operation=mul&a=2&b=3 | 200 | 6 |
| /calc?operation=mul&a=4&b=0 | 200 | 0 |
| /calc?operation=div&a=22&b=11 | 200 | 2 |
| /calc?operation=div&a=2&b=4 | 200 | 0.5 |
| /fs?operation=create&filename=tf.txt&text=23 | 201 | tf.txt was created |
| /fs?operation=create&filename=aloha.txt&text=hello | 201 | aloha.txt was created |
| /fs?operation=read&filename=aloha.txt | 201 | hello |
| /fs?operation=read&filename=qq.txt | 400 | File not found |
| /calc?operation=read&filename=qq.txt | 400 | Operation unknown |
| /fs?operation=add&a=3&b=33 | 400 | Operation unknown |
| /psss | 400 | Operation unknown |

## Running tests
Run `npm i` for installing dependencies, and then `npm run test` for running tests.  Please refrain from making any changes in the [tests](./src/__tests__) folder.