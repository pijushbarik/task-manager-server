const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const taskService = require('./task.service');

const createSubtask = async (taskId, taskBody) => {
  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found")
  }

  task.subtasks.push(taskBody);
  await task.save();

  return task.subtasks.slice(-1)[0];
};

const querySubtasks = async (taskId) => {
  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found")
  }

  return task.subtasks;
};

const getSubtaskById = async (taskId, subtaskId) => {
  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found")
  }

  return task.subtasks.id(subtaskId);
};

const updateSubtaskById = async (taskId, subtaskId, updateBody) => {
  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found")
  }

  const subtask = task.subtasks.id(subtaskId);

  if (!subtask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subtask not found');
  }

  subtask.set(updateBody);
  await task.save();

  return subtask;
};

const deleteSubtaskById = async (taskId, subtaskId) => {
  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found")
  }

  const subtask = task.subtasks.id(subtaskId);
  if (!subtask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subtask not found');
  }

  await subtask.remove();
  await task.save();

  return subtask;
};

module.exports = {
  createSubtask,
  querySubtasks,
  getSubtaskById,
  updateSubtaskById,
  deleteSubtaskById,
};