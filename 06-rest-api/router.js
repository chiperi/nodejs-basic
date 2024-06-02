const url = require("url");
const {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTaskById,
  generateResponse
} = require("./controllers/taskController");

const router = (req, res) => {
  //write logic to parse request url and choose method from taskController according to endpoint
  const tasksUrl = "/api/v1/tasks";
  const taskUrlWithId = /^\/api\/v1\/tasks\/([a-zA-Z0-9-]+)$/;
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === tasksUrl && req.method === "GET") {
    getTasks(query, res);
  }
  else if (pathname.match(taskUrlWithId) && req.method === "GET") {
    getTaskById(pathname, res);
  }
  else if (pathname === tasksUrl && req.method === "POST") {
    addTask(req, res);
  }
  else if (pathname.match(taskUrlWithId) && req.method === "PATCH") {
    updateTask(req, res);
  }
  else if (pathname.match(taskUrlWithId) && req.method === "DELETE") {
    deleteTaskById(pathname, res);
  }
  else {
    generateResponse(res, 404, "Route Not Found: Please use the /api/v1/tasks endpoint");
  }
};

module.exports = router;
