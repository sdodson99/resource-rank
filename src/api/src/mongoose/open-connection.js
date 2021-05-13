const mongoose = require('mongoose');

/**
 * Open a MongoDB connection.
 * @param {string} connectionString The MongoDB connection string.
 */
async function connect(connectionString) {
  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connect;
