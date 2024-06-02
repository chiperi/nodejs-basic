## REST API task

### Description

Create a web application that implements a REST API using Node.js.
It should be a simple TODO list application with the following
endpoints:

1. GET `/api/v1/tasks` - retrieves all tasks.It is possible to filter this task by `completed` field using the query parameter `filterByCompleted=false` or `filterByCompleted=true`. As result app should send respons with status `200` and list of tasks.
1. GET `/api/v1/tasks/:id` - retrieves task with corresponding id. As result app should send respons with status `200` and found task.
1. POST `/api/v1/tasks` - create new task with unique id. To create new task user need to send body with request like this `{"todo": "Task example"}`, field `completed` automatically is set as `false`. As result app should send respons with status `201` and created task.
1. DELETE `/api/v1/tasks/:id` - delete task with corresponding id.As result app should send respons with status `200` and a message `` "Task with id `{id}` was deleted ``.
1. PATCH `/api/v1/tasks/:id` - update fileds `todo` or/and `completed` in task with corresponding id. Note that, it possible change one or both fields by one request. As result app should send respons with status `200` and updated task.

In case when in request url `:id` is present and if task with this `id` does not exist server should be send respons with status `404` and a message `` "Task with id `{id}` not found ``.

Model for the task is simple:

```
{
  "id": string,
  "todo": string,
  "completed": bolean
}
```

### Tip and tricks

All tasks must be saved in [tasks.json](./data/tasks.json) file. Also [example](./data/tasks.json.example) of this file is present.

This task can be solved without any frameworks or additional libraries (uuid is suggested to generete unique ids but it is not strict rule).

Use prepered project structure.
[server.js](./server.js) is root file of project, [app.js](./app.js) create http server and add [router](./router.js) for server.
[utils.js](./utils.js) help you write tasks in file and parse body of request.

Write endpoints logic in [router](./router.js), controllers in [taskController.js](./controllers/taskController.js) and write code in [taskModel.js](./models/taskModel.js) to work with data file.

### How to run and test

In order to run server on `http://localhost:3000`, use the command `npm start`. The server will be hosted at `http://localhost:3000`. You can use Postman to send requests to the server for testing purposes.

In order to run tests localy before autograding on GitHub, use the command `npm test`. Please do not modify any files in the [tests](./tests/) directory.

For correct test passing do not use import of json files (`require("../data/tasks")`) in your code, for reading and writing the file use functions `readTasks` and `writeTasks` from [utils](./utils.js).
