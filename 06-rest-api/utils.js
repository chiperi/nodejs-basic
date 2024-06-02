const fs = require("fs/promises");
const tasksFilePath = `./data/tasks.json`;

exports.readTasks = async () => {
  const data = await fs.readFile(tasksFilePath);
  return JSON.parse(data);
};

exports.writeTasks = async (tasks) => {
  await fs.writeFile(tasksFilePath, JSON.stringify(tasks), "utf8");
};

exports.getPostData = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
};
