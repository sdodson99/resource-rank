const mongoose = require('mongoose');
const { openMongoConnection } = require('../open-mongo-connection');

jest.mock('mongoose');

describe('openMongoConnection', () => {
  let connectionString;

  beforeEach(() => {
    connectionString = 'connection-string';
  });

  afterEach(() => {
    mongoose.connect.mockReset();
  });

  it('should open Mongoose connection', async () => {
    await openMongoConnection(connectionString);

    expect(mongoose.connect).toBeCalledWith(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  it('should throw error if connection fails', async () => {
    mongoose.connect.mockImplementation(() => {
      throw new Error('Error');
    });

    await expect(async () => {
      await openMongoConnection(connectionString);
    }).rejects.toThrow();
  });
});
