const { Schema, model } = require('mongoose');

const ratingSchema = new Schema({
  value: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource',
  },
  topic: { type: Schema.Types.ObjectId, ref: 'Topic' },
  createdBy: {
    type: String,
  },
});

const RatingModel = model('Rating', ratingSchema);

exports.RatingModel = RatingModel;
