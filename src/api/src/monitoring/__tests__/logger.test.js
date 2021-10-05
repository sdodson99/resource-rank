process.env.FIREBASE_CONFIG = {};
process.env.GCLOUD_PROJECT = {};

const functions = require('firebase-functions');
const logger = require('../logger');

jest.mock('firebase-functions');

describe('logger', () => {
  let logMessage;

  beforeEach(() => {
    logMessage = 'test';
  });

  afterEach(() => {
    functions.logger.debug.mockReset();
    functions.logger.info.mockReset();
    functions.logger.warn.mockReset();
    functions.logger.error.mockReset();
  });

  it('should handle debug logs', () => {
    logger.debug(logMessage);

    expect(functions.logger.debug).toBeCalledWith(logMessage);
  });
  it('should handle info logs', () => {
    logger.info(logMessage);

    expect(functions.logger.info).toBeCalledWith(logMessage);
  });

  it('should handle warning logs', () => {
    logger.warn(logMessage);

    expect(functions.logger.warn).toBeCalledWith(logMessage);
  });

  it('should handle error logs', () => {
    logger.error(logMessage);

    expect(functions.logger.error).toBeCalledWith(logMessage);
  });
});
