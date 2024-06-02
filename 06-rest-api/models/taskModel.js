const { v4 } = require("uuid");
const { writeTasks, readTasks } = require("../utils");
const { getTasks } = require("../controllers/taskController");

const findAll = async () => await readTasks();

const findByCompleted = async (completed) => {
  //return filtered tasks
  const tasks = await findAll();
  return tasks.filter((task) => task.completed.toString().includes(completed.toString()));
};

const findById = async (id) => {
  //return task with corresponding id
  const tasks = await findAll();
  return tasks.find((task) => task.id.toString() === id.toString());
};

const create = async (todo) => {
  /* create new task with unique id, push it into array of tasks,
    write new array in file and return created task*/
    let id = undefined;
    do{
      id = v4();
    } while (await findById(id) && id !== undefined);

    const newTask = {
      id,
      todo,
      completed: false
    };

    const tasks = await findAll();
    tasks.push(newTask);
    return await writeTasks(tasks)
      .then(() => newTask)
      .catch(err => {
        console.log(err);
        throw err;
      });
};

const update = async (id, {todo, completed}) => {
  /* find task, update info in it,
    write new array of tasks into file
    return updated task*/
    const allTasks = await findAll();
    const index = allTasks.findIndex(t => t.id.toString().includes(id.toString()));
    const taskFromDB = allTasks[index];

    allTasks[index] = {
      ...taskFromDB, 
      todo: todo || taskFromDB.todo,
      completed: completed !== undefined ? completed : taskFromDB.completed
    };

    return await writeTasks(allTasks)
      .then(() => allTasks[index])
      .catch(err => {
        console.log(err);
        throw err;
      });
};

const remove = async (id) => {
  /* find task, delete it from array of tasks,
  write new array of tasks into file*/
  const allTasks = await findAll();
  const index = allTasks.findIndex(t => t.id.toString().includes(id.toString()));
  if (index === -1) return false;

  allTasks.splice(index, 1);

  return await writeTasks(allTasks)
      .then(() => true)
      .catch(() => false);
};

module.exports = {
  findAll,
  findByCompleted,
  findById,
  create,
  update,
  remove,
};
