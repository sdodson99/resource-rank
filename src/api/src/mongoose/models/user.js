const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  dateJoined: { type: Date, default: Date.now },
});

const User = model('User', userSchema);

module.exports = {
  userSchema,
  User,
};
