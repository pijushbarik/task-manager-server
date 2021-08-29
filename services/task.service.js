const httpStatus = require('http-status');
const Task = require('../models/task.model');
const ApiError = require('../utils/ApiError');

const createTask = async (taskBody) => {
  return Task.create(taskBody);
};

const queryTasks = async () => {
  const tasks = await Task.find();
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