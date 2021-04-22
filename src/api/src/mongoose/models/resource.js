const { Schema, model } = require('mongoose');

const resourceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  link: String,
  dateCreated: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Resource = model('Resource', resourceSchema);

module.exports = {
  resourceSchema,
  Resource,
};
