const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubtask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId)
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
  })
};

const getSubtasks = {
  params: {
    taskId: Joi.string().custom(objectId)
  }
};

const getSubtask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
    subtaskId: Joi.string().custom(objectId)
  }),
};

const updateSubtask = {
  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
    subtaskId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
		.keys({
      title: Joi.string(),
      status: Joi.string().valid("todo", "in_progress", "completed")
    })
    .min(1),
};

const deleteSubtask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
    subtaskId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSubtask,
  getSubtasks,
  getSubtask,
  updateSubtask,
  deleteSubtask,
};