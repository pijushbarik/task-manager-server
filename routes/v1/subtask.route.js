const express = require('express');
const validate = require('../../middlewares/validate');
const subtaskValidation = require('../../validations/subtask.validation');
const subtaskController = require('../../controllers/subtask.controller');

const router = express.Router({mergeParams: true});

router
  .route('/')
  .post(validate(subtaskValidation.createSubtask), subtaskController.createSubtask)
  .get(validate(subtaskValidation.getSubtasks), subtaskController.getSubtasks);

router
  .route('/:subtaskId')
  .get(validate(subtaskValidation.getSubtask), subtaskController.getSubtask)
  .put(validate(subtaskValidation.updateSubtask), subtaskController.updateSubtask)
  .delete(validate(subtaskValidation.deleteSubtask), subtaskController.deleteSubtask);

module.exports = router;