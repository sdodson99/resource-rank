const { Schema, model } = require('mongoose');

const topicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  resources: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
    },
  ],
  dateCreated: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Topic = model('Topic', topicSchema);

module.exports = {
  topicSchema,
  Topic,
};
