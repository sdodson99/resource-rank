const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createGQLServer } = require('../create-gql-server');
const createReadOnlyModeHandler = require('../middleware/handle-read-only-mode');
const {
  Authenticator,
} = require('../../features/authentication/authenticator');

jest.mock('express');
jest.mock('apollo-server-express');
jest.mock('../middleware/handle-read-only-mode');
jest.mock('../../features/authentication/authenticator');

describe('createGQLServer', () => {
  let mockApp;
  let mockApolloServer;

  let readOnlyModeDataSource;
  let featureFlagsDataSource;
  let mockAuthenticate;

  beforeEach(() => {
    mockApp = {
      use: jest.fn(),
    };
    express.mockReturnValue(mockApp);

    mockApolloServer = {
      applyMiddleware: jest.fn(),
    };
    ApolloServer.mockReturnValue(mockApolloServer);

    readOnlyModeDataSource = {};
    featureFlagsDataSource = {};

    mockAuthenticate = jest.fn();
    Authenticator.mockReturnValue({
      authenticate: mockAuthenticate,
    });
  });

  afterEach(() => {
    createReadOnlyModeHandler.mockReset();
    ApolloServer.mockReset();
    Authenticator.mockReset();
  });

  it('should create ApolloServer w/ Express', () => {
    const app = createGQLServer({
      readOnlyModeDataSource,
      featureFlagsDataSource,
    });

    expect(mockApolloServer.applyMiddleware).toBeCalledWith({
      app: mockApp,
      path: '/',
      cors: true,
    });
    expect(app).toBe(mockApp);
  });

  it('should use read only mode middleware', () => {
    const mockReadOnlyModeHandler = jest.fn();
    createReadOnlyModeHandler.mockReturnValue(mockReadOnlyModeHandler);

    createGQLServer({
      readOnlyModeDataSource,
      featureFlagsDataSource,
    });

    expect(mockApp.use).toBeCalledWith(mockReadOnlyModeHandler);
  });

  it('should create ApolloServer with context that authenticates users', async () => {
    const expectedUser = {
      id: '123',
    };
    mockAuthenticate.mockReturnValue(expectedUser);

    createGQLServer({
      readOnlyModeDataSource,
      featureFlagsDataSource,
    });
    const contextFunction = ApolloServer.mock.calls[0][0].context;
    const { user: actualUser } = await contextFunction({});

    expect(actualUser).toBe(expectedUser);
  });

  it('should create ApolloServer with data sources', () => {
    createGQLServer({
      readOnlyModeDataSource,
      featureFlagsDataSource,
    });
    const dataSourcesFunction = ApolloServer.mock.calls[0][0].dataSources;
    const {
      users,
      topics,
      resources,
      ratings,
      featureFlags,
    } = dataSourcesFunction();

    expect(featureFlags).toBe(featureFlagsDataSource);
    expect(users).toBeTruthy();
    expect(topics).toBeTruthy();
    expect(resources).toBeTruthy();
    expect(ratings).toBeTruthy();
  });
});
