const mongoose = require('mongoose');
const connect = require('../open-connection');

jest.mock('mongoose');

describe('connect', () => {
  let connectionString;

  beforeEach(() => {
    connectionString = 'connection-string';
  });

  afterEach(() => {
    mongoose.connect.mockReset();
  });

  it('should open Mongoose connection', async () => {
    await connect(connectionString);

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
      await connect(connectionString);
    }).rejects.toThrow();
  });
});
