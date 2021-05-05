const { Schema, model } = require('mongoose');

const topicResourceSchema = new Schema({
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource',
  },
  dateCreated: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const topicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  resources: [topicResourceSchema],
  dateCreated: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Topic = model('Topic', topicSchema);

module.exports = {
  topicSchema,
  Topic,
};
