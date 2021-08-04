const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createGQLServer } = require('../create-gql-server');
const createReadOnlyModeHandler = require('../../middleware/handle-read-only-mode');

jest.mock('express');
jest.mock('apollo-server-express');
jest.mock('../../middleware/handle-read-only-mode');

describe('createGQLServer', () => {
  let mockApp;
  let mockApolloServer;

  let readOnlyModeDataSource;
  let userDecoder;
  let usersDataSource;

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
    userDecoder = {
      getUserFromRequest: jest.fn(),
    };
    usersDataSource = {};
  });

  afterEach(() => {
    createReadOnlyModeHandler.mockReset();
    ApolloServer.mockReset();
  });

  it('should create ApolloServer w/ Express', () => {
    const app = createGQLServer({
      readOnlyModeDataSource,
      userDecoder,
      usersDataSource,
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
      userDecoder,
      usersDataSource,
    });

    expect(mockApp.use).toBeCalledWith(mockReadOnlyModeHandler);
  });

  it('should create ApolloServer with context that authenticates users', async () => {
    const expectedUser = {
      name: 'name',
    };
    userDecoder.getUserFromRequest.mockReturnValue(expectedUser);

    createGQLServer({
      readOnlyModeDataSource,
      userDecoder,
      usersDataSource,
    });
    const contextFunction = ApolloServer.mock.calls[0][0].context;
    const { user: actualUser } = await contextFunction({});

    expect(actualUser).toBe(expectedUser);
  });

  it('should create ApolloServer with data sources', () => {
    createGQLServer({
      readOnlyModeDataSource,
      userDecoder,
      usersDataSource,
    });
    const dataSourcesFunction = ApolloServer.mock.calls[0][0].dataSources;
    const {
      readOnlyModeDataSource: actualReadOnlyModeDataSource,
      usersDataSource: actualUsersDataSource,
      topics,
      resources,
      ratings,
    } = dataSourcesFunction();

    expect(actualReadOnlyModeDataSource).toBe(readOnlyModeDataSource);
    expect(actualUsersDataSource).toBe(usersDataSource);
    expect(topics).toBeTruthy();
    expect(resources).toBeTruthy();
    expect(ratings).toBeTruthy();
  });
});
