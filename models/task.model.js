const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.plugin');
const { subtaskSchema } = require("./subtask.model")

const taskSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			require: true,
			enum: ["todo", "in_progress", "completed"],
			default: "todo"
		},
		subtasks: [subtaskSchema]
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);

/**
 * @typedef Task
 */
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;