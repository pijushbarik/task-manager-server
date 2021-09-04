const catchAsync = require('../utils/catchAsync');
const taskService = require('../services/task.service');
const subtaskService = require('../services/subtask.service');

const socketController = catchAsync(async (socket) => {
  const emitPartialDataUpdate = (data) => {
    socket.emit('partialDataUpdate', data);
    socket.broadcast.emit('partialDataUpdate', data);
  };

  socket.on(
    'getTasks',
    catchAsync(async () => {
      const tasks = await taskService.queryTasks();
      socket.emit('newData', tasks);
    })
  );

  socket.on(
    'createTask',
    catchAsync(async (data) => {
      const task = await taskService.createTask(data);
      emitPartialDataUpdate({
        type: 'CREATE_TASK',
        status: task.status,
        order: task.order,
        id: task.id,
        task,
      });
    })
  );

  socket.on(
    'updateTask',
    catchAsync(async (data) => {
      const task = await taskService.updateTaskById(data.id, data.updateBody);
      emitPartialDataUpdate({
        type: 'UPDATE_TASK',
        status: task.status,
        order: task.order,
        id: task.id,
        task,
      });
    })
  );

  socket.on(
    'deleteTask',
    catchAsync(async (data) => {
      const task = await taskService.deleteTaskById(data.id);
      emitPartialDataUpdate({
        type: 'DELETE_TASK',
        status: task.status,
        order: task.order,
        id: task.id,
        task,
      });
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
