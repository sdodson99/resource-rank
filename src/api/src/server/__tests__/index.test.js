const { https, config } = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const { createGQLServer } = require('../create-gql-server');
const { openMongoConnection } = require('../open-mongo-connection');
const { when } = require('jest-when');

jest.mock('firebase-functions');
jest.mock('firebase-admin');
jest.mock('../create-gql-server');
jest.mock('../open-mongo-connection');
jest.mock(
  '../../features/feature-flags/read-only-mode/read-only-mode-data-source'
);
jest.mock('../../features/feature-flags/queries/get-all-feature-flags-query');
jest.mock('../../features/feature-flags/queries/feature-flag-enabled-query');
jest.mock('../../features/feature-flags/graphql/feature-flags-data-source');

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
