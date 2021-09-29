process.env.FIREBASE_CONFIG = {};
process.env.GCLOUD_PROJECT = {};

const functions = require('firebase-functions');

jest.mock('firebase-functions');

afterEach(() => {
  functions.logger.debug.mockReset();
  functions.logger.info.mockReset();
  functions.logger.warn.mockReset();
  functions.logger.error.mockReset();
});
