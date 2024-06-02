const request = require("supertest");
jest.mock("fs/promises");
const fs = require("fs/promises");

let app = require("../app");
const tasksFilePath = `./data/tasks.json`;

let mockTasks;

fs.readFile.mockImplementation(
  jest.fn((filePath) => {
    if (filePath === tasksFilePath) {
      return Promise.resolve(JSON.stringify(mockTasks));
    }
  })
);

fs.writeFile.mockImplementation(
  jest.fn((filePath, newTasks) => {
    if (filePath === tasksFilePath) {
      mockTasks = JSON.parse(newTasks);
      return Promise.resolve();
    }
  })
);

describe("GET /api/v1/tasks", () => {
  it("responds with 200 status code and 1 task", async () => {
    mockTasks = [1];
    const response = await request(app).get("/api/v1/tasks");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });
  it("responds with 200 status code and 2 tasks", async () => {
    mockTasks = [1, 2];
    const response = await request(app).get("/api/v1/tasks");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });
});

describe("GET /api/v1/tasks/{id}", () => {
  it("responds with 200 status code and 1 task", async () => {
    mockTasks = [
      {
        id: 1,
        todo: "Do something nice for someone I care about",
        completed: false,
      },
    ];
    const response = await request(app).get("/api/v1/tasks/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockTasks[0]);
  });
  it("It should return 404 status code with message", async () => {
    const response = await request(app).get(`/api/v1/tasks/non-exist-id`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task with id non-exist-id not found");
  });
});

describe("POST /api/v1/tasks", () => {
  let taskId;
  const newTask = { todo: "New task" };
  it("It should create and return new task", async () => {
    const response = await request(app).post("/api/v1/tasks").send(newTask);
    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.todo).toBe("New task");
    expect(response.body.completed).toBe(false);
    taskId = response.body.id;
  });
  it("It should return created task in list of all tasks", async () => {
    const response = await request(app).get("/api/v1/tasks");
    expect(response.statusCode).toBe(200);
    const createdTask = response.body.find((task) => task.id === taskId);
    expect(createdTask.todo).toEqual(newTask.todo);
  });
  it("It should return created task by its` id", async () => {
    const response = await request(app).get(`/api/v1/tasks/${taskId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      todo: newTask.todo,
      id: taskId,
      completed: false,
    });
  });
});

describe("PATCH /api/v1/tasks/{id}", () => {
  it("It should update a task with new todo and completed", async () => {
    mockTasks = [
      {
        id: 42,
        todo: "Do something nice for someone I care about",
        completed: false,
      },
    ];
    const response = await request(app)
      .patch(`/api/v1/tasks/42`)
      .send({ todo: "Updated task", completed: true });
    expect(response.statusCode).toBe(200);
    expect(response.body.todo).toBe("Updated task");
    expect(response.body.completed).toBe(true);
  });
  it("It should update a task with only completed", async () => {
    mockTasks = [
      {
        id: 43,
        todo: "Do something nice for someone I care about",
        completed: false,
      },
    ];
    const response = await request(app)
      .patch(`/api/v1/tasks/43`)
      .send({ completed: true });
    expect(response.statusCode).toBe(200);
    expect(response.body.todo).toBe(mockTasks[0].todo);
    expect(response.body.completed).toBe(true);
  });
  it("It should return 404 status code with message", async () => {
    const response = await request(app)
      .patch(`/api/v1/tasks/non-exist-id`)
      .send({ todo: "Updated task", completed: true });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task with id non-exist-id not found");
  });
});

describe("DELETE /api/v1/tasks/{id}", () => {
  it("It should delete task with id 1 and return 200 status code with message", async () => {
    mockTasks = [
      {
        id: 1,
        todo: "Do something nice for someone I care about",
        completed: false,
      },
    ];
    const response = await request(app).delete(`/api/v1/tasks/1`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Task with id 1 was deleted");
  });

  it("It should not exist task with id 1 after it is deleted", async () => {
    const response = await request(app).get(`/api/v1/tasks/1`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task with id 1 not found");
  });

  it("It should return 404 status code with message", async () => {
    const response = await request(app).delete(`/api/v1/tasks/non-exist-id`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task with id non-exist-id not found");
  });
});
