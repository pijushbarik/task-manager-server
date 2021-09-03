const httpStatus = require('http-status');
const Task = require('../models/task.model');
const ApiError = require('../utils/ApiError');

const createTask = async (taskBody) => {
  const task = await Task.findOne({ status: 'todo' }).sort('-order').exec();

  if (!task) {
    Object.assign(taskBody, { order: 0 });
  } else {
    Object.assign(taskBody, { order: task.order + 1 });
  }

  return Task.create(taskBody);
};

const queryTasks = async () => {
  const tasks = await Task.find().sort('order').exec();
  tasks.forEach((t) => t.subtasks.sort((a, b) => a.order - b.order));
  return tasks;
};

const getTaskById = async (id) => {
  return Task.findById(id);
};

const updateTaskById = async (taskId, updateBody) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  if (typeof updateBody.order === 'number') {
    const newOrder = updateBody.order;
    const currentOrder = task.order;

    await Task.updateMany(
      {
        id: { $ne: task.id },
        order:
          newOrder < currentOrder
            ? { $gte: newOrder, $lt: currentOrder }
            : { $lte: newOrder, $gt: currentOrder },
        status: task.status,
      },
      {
        $inc: {
          order: newOrder < currentOrder ? 1 : -1,
        },
      }
    );
  }

  Object.assign(task, updateBody);
  await task.save();

  return task;
};

const deleteTaskById = async (taskId) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  await task.remove();
  return task;
};

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};
