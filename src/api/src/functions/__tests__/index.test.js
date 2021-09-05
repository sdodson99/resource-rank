const { https, config } = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const { createGQLServer } = require('../../server/create-gql-server');
const openMongoConnection = require('../../mongoose/open-connection');
const { when } = require('jest-when');

jest.mock('firebase-functions');
jest.mock('firebase-admin');
jest.mock('../../server/create-gql-server');
jest.mock('../../mongoose/open-connection');
jest.mock('../../data-sources/read-only-mode/read-only-mode-data-source');
jest.mock('../../services/feature-flags/get-all-querier');
jest.mock('../../services/feature-flags/enabled-querier');
jest.mock('../../data-sources/feature-flags');

describe('API Firebase Function', () => {
  let mockConnectionString;
  let mockServer;

  beforeEach(() => {
    mockConnectionString = 'connection-string';
    config.mockReturnValue({
      mongo: {
        connection_string: mockConnectionString,
      },
    });

    mockServer = {};
    createGQLServer.mockReturnValue(mockServer);
  });

  afterEach(() => {
    config.mockReset();
    createGQLServer.mockReset();
  });

  it('should export HTTPS function forwarding requests to GraphQL API', () => {
    const mockApi = jest.fn();
    when(https.onRequest).calledWith(mockServer).mockReturnValue(mockApi);

    const { api } = require('..');

    expect(api).toBe(mockApi);
  });

  it('should initialize Firebase', () => {
    require('..');

    expect(firebaseAdmin.initializeApp).toBeCalled();
  });

  it('should open MongoDB connection', () => {
    require('..');

    expect(openMongoConnection).toBeCalledWith(mockConnectionString);
  });
});
