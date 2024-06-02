const Task = require("../models/taskModel");
const { getPostData } = require("../utils");
const url = require("url");

const generateResponse = (res, status, data) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  switch (status) {
    case 200:
    case 201:
      res.end(JSON.stringify(data));
      break;
    case 404:
      res.end(JSON.stringify({statusCode: status, statusName: "not_found", message: data }));
      break;
    default:
      res.end(JSON.stringify({statusCode: status, statusName: 'server_error', message: data }));
  }
};

const getIdFromPath = (req) => {
  const reqSplit = req.split("/");
  return reqSplit[reqSplit.length - 1];
}

// @desc Gets All tasks with filter
// @route   GET /api/tasks?filterByCompleted=true|false
const getTasks = async (query, res) => {
  // implement logic to obtain all tasks or tasks with filtering and send tasks as response
  try {
    const tasks = [...(await Task.findAll())];

    if (tasks.length === 0) 
      generateResponse(res, 404, "Tasks not found");

    if (query.filterByCompleted) 
      tasks.filter(task => task.completed === query.filterByCompleted);

    generateResponse(res, 200, tasks);
  } catch ({status, data}) {
    generateResponse(res, status, data);
  }
};

// @desc Get task by id
// @route   GET /api/tasks/:id
const getTaskById = async (req, res) => {
  // implement logic to obtain task by id and send this task as response
  try {
    const id = getIdFromPath(req);
    if (id === undefined) generateResponse(res, 400, "Bad Request");

    const task = await Task.findById(id);
    if (task === undefined) generateResponse(res, 404, `Task with id ${id} not found`);

    generateResponse(res, 200, task);
  } catch ({status, data}) {
    generateResponse(res, status, data);
  }
};

// @desc Create new task
// @route   POST /api/tasks
const addTask = async (req, res) => {
  // implement logic to create task and send created task as response
  try {
    const postData = JSON.parse(await getPostData(req));
    const task = await Task.create(postData.todo);

    if (task) generateResponse(res, 201, task);
    else generateResponse(res, 500, "Internal server error");
  } catch ({status, data}) {
    generateResponse(res, status, data);
  }
};

// @desc Update task by id
// @route   PATCH /api/tasks/:id
const updateTask = async (req, res) => {
  // implement logic to update task and send updated task as response
  try {
    const { pathname } = url.parse(req.url, true);
    const postData = JSON.parse(await getPostData(req));
    const id = getIdFromPath(pathname);
    
    if (!id) generateResponse(res, 400, "Id not provided");
    const taskExists = !! await Task.findById(id);
    if (!taskExists) generateResponse(res, 404, `Task with id ${id} not found`);
    else {
      const task = await Task.update(id, postData);

      if (task) generateResponse(res, 200, task);
      else generateResponse(res, 500, "Internal server error");
    }
  } catch ({status, data}) {
    generateResponse(res, status, data);
  }
};

// @desc delete task by id
// @route   DELETE /api/tasks/:id
const deleteTaskById = async (req, res) => {
  // implement logic to delete task
  const id = getIdFromPath(req);
  if (!id) generateResponse(res, 400, "Id not provided");
  const response = await Task.remove(id);

  if (!!response) {
    generateResponse(res, 200, {message: `Task with id ${id} was deleted`});
  } else if (!response) {
    generateResponse(res, 404, `Task with id ${id} not found`);
  } else {
    generateResponse(res, 500, `Error deleting task with id ${id}`);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTaskById,
  generateResponse
};
