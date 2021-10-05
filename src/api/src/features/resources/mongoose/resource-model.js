const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const resourceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  link: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

resourceSchema.plugin(mongoosePaginate);

const ResourceModel = model('Resource', resourceSchema);

exports.ResourceModel = ResourceModel;
