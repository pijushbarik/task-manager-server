const catchAsync = require('../utils/catchAsync');
const taskService = require('../services/task.service');
const subtaskService = require('../services/subtask.service');

const socketController = catchAsync(async (socket) => {
  const tasks = await taskService.queryTasks();
  socket.emit('newData', tasks);

  socket.on(
    'createTask',
    catchAsync(async (data) => {
      await taskService.createTask(data);
      const tasks = await taskService.queryTasks();
      socket.emit('newData', tasks);
      socket.broadcast.emit('newData', tasks);
    })
  );

  socket.on(
    'updateTask',
    catchAsync(async (data) => {
      await taskService.updateTaskById(data.id, data.updateBody);
      const tasks = await taskService.queryTasks();
      socket.emit('newData', tasks);
      socket.broadcast.emit('newData', tasks);
    })
  );

  socket.on(
    'deleteTask',
    catchAsync(async (data) => {
      await taskService.deleteTaskById(data.id);
      const tasks = await taskService.queryTasks();
      socket.emit('newData', tasks);
      socket.broadcast.emit('newData', tasks);
    })
  );

  socket.on(
    'createSubtask',
    catchAsync(async (data) => {
      await subtaskService.createSubtask(data.taskId, data.body);
      const tasks = await taskService.queryTasks();
      socket.emit('newData', tasks);
      socket.broadcast.emit('newData', tasks);
    })
  );

  socket.on(
    'updateSubtask',
    catchAsync(async (data) => {
      await subtaskService.updateSubtaskById(
        data.taskId,
        data.subtaskId,
        data.updateBody
      );
      const tasks = await taskService.queryTasks();
      socket.emit('newData', tasks);
      socket.broadcast.emit('newData', tasks);
    })
  );

  socket.on(
    'deleteSubtask',
    catchAsync(async (data) => {
      await subtaskService.deleteSubtaskById(data.taskId, data.subtaskId);
      const tasks = await taskService.queryTasks();
      socket.emit('newData', tasks);
      socket.broadcast.emit('newData', tasks);
    })
  );
});

module.exports = socketController;
