const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.plugin');

const subtaskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['todo', 'in_progress', 'completed'],
      default: 'todo',
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
subtaskSchema.plugin(toJSON);

/**
 * @typedef Subtask
 */
const Subtask = mongoose.model('Subtask', subtaskSchema);

module.exports = Subtask;
module.exports.subtaskSchema = subtaskSchema;
