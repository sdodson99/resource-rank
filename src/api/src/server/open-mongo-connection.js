const mongoose = require('mongoose');
const logger = require('../monitoring/logger');

/**
 * Open a MongoDB connection.
 * @param {string} connectionString The MongoDB connection string.
 */
async function openMongoConnection(connectionString) {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('Successfully opened Mongo connection.');
  } catch (error) {
    logger.error('Failed to open Mongo connection.', error);
    throw error;
  }
}

exports.openMongoConnection = openMongoConnection;
