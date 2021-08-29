const express = require('express');
const taskRoute = require('./task.route');
const subtaskRoute = require("./subtask.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: '/tasks',
    route: taskRoute,
  },
  {
    path: '/tasks/:taskId/s',
    route: subtaskRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;