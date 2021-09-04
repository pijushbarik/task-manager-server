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
      const task = await taskService.createTask(data, true);
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
      const [task, subtask] = await Promise.all([
        taskService.getTaskById(data.taskId),
        subtaskService.createSubtask(data.taskId, data.body),
      ]);
      emitPartialDataUpdate({
        type: 'CREATE_SUBTASK',
        subtaskStatus: subtask.status,
        status: task.status,
        order: subtask.order,
        id: subtask.id,
        taskId: task.id,
        subtask,
      });
    })
  );

  socket.on(
    'updateSubtask',
    catchAsync(async (data) => {
      const [task, subtask] = await Promise.all([
        taskService.getTaskById(data.taskId),
        subtaskService.updateSubtaskById(
          data.taskId,
          data.subtaskId,
          data.updateBody
        ),
      ]);
      emitPartialDataUpdate({
        type: 'UPDATE_SUBTASK',
        subtaskStatus: subtask.status,
        status: task.status,
        order: subtask.order,
        id: subtask.id,
        taskId: task.id,
        subtask,
      });
    })
  );

  socket.on(
    'deleteSubtask',
    catchAsync(async (data) => {
      const [task, subtask] = await Promise.all([
        taskService.getTaskById(data.taskId),
        subtaskService.deleteSubtaskById(data.taskId, data.subtaskId),
      ]);
      emitPartialDataUpdate({
        type: 'DELETE_SUBTASK',
        subtaskStatus: subtask.status,
        status: task.status,
        order: subtask.order,
        id: subtask.id,
        taskId: task.id,
        subtask,
      });
    })
  );
});

module.exports = socketController;
