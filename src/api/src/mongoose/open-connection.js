const mongoose = require('mongoose');

/**
 * Open a MongoDB connection.
 * @param {string} connectionString The MongoDB connection string.
 * @return {mongoose.Connection} The MongoDB connection.
 */
async function connect(connectionString) {
  const { connection } = await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return connection;
}

module.exports = connect;
