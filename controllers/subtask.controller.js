const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const subtaskService = require('../services/subtask.service');

const createSubtask = catchAsync(async (req, res) => {
  const task = await subtaskService.createSubtask(req.params.taskId, req.body);
  res.status(httpStatus.CREATED).send(task);
});

const getSubtasks = catchAsync(async (req, res) => {
  const result = await subtaskService.querySubtasks(req.params.taskId);
  res.send(result);
});

const getSubtask = catchAsync(async (req, res) => {
  const task = await subtaskService.getSubtaskById(req.params.taskId, req.params.subtaskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subtask not found');
  }
  res.send(task);
});

const updateSubtask = catchAsync(async (req, res) => {
  const task = await subtaskService.updateSubtaskById(req.params.taskId, req.params.subtaskId, req.body);
  res.send(task);
});

const deleteSubtask = catchAsync(async (req, res) => {
  await subtaskService.deleteSubtaskById(req.params.taskId, req.params.subtaskId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubtask,
  getSubtasks,
  getSubtask,
  updateSubtask,
  deleteSubtask,
};