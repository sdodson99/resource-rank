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
});
