const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const taskService = require('./task.service');

const createSubtask = async (taskId, taskBody) => {
  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const maxOrder = task.subtasks.reduce(
    (acc, curr) => (curr.order > acc ? curr.order : acc),
    -1
  );

  Object.assign(taskBody, { order: maxOrder + 1 });

  task.subtasks.push(taskBody);
  await task.save();

  return task.subtasks.slice(-1)[0];
};

const querySubtasks = async (taskId) => {
  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  return task.subtasks.sort((a, b) => a.order - b.order);
};

const getSubtaskById = async (taskId, subtaskId) => {
  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  return task.subtasks.id(subtaskId);
};

const updateSubtaskById = async (taskId, subtaskId, updateBody) => {
  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const subtask = task.subtasks.id(subtaskId);

  if (!subtask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subtask not found');
  }

  if (typeof updateBody.order === 'number') {
    const newOrder = updateBody.order;
    const currentOrder = subtask.order;

    for (let i = 0; i < task.subtasks.length; i++) {
      const st = task.subtasks[i];

      if (
        newOrder < currentOrder &&
        st.order >= newOrder &&
        st.order < currentOrder
      ) {
        st.order += 1;
      } else if (st.order <= newOrder && st.order > currentOrder) {
        st.order -= 1;
      }
    }
  }

  subtask.set(updateBody);
  await task.save();

  return subtask;
};

const deleteSubtaskById = async (taskId, subtaskId) => {
  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
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
