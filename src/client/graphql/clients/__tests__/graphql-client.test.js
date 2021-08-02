import { GraphQLClient as GraphQLClientBase } from 'graphql-request';
import GraphQLClient from '../graphql-client';
import firebase from 'firebase/app';

jest.mock('graphql-request');
jest.mock('firebase/app');

describe('GraphQLClient', () => {
  let client;

  let mockBaseClientFetch;
  let mockBaseClientSetHeader;
  let mockFirebaseAuth;

  let url;
  let document;
  let variables;

  beforeEach(() => {
    url = 'url';
    document = 'document';
    variables = {
      test: 'test',
    };

    mockBaseClientFetch = jest.fn();
    mockBaseClientSetHeader = jest.fn();
    GraphQLClientBase.mockReturnValue({
      request: mockBaseClientFetch,
      setHeader: mockBaseClientSetHeader,
    });

    mockFirebaseAuth = jest.fn();
    firebase.auth = mockFirebaseAuth;

    client = new GraphQLClient(url);
  });

  describe('fetch', () => {
    it('should return result for document and variables', async () => {
      const expected = {
        data: 'data',
      };
      mockBaseClientFetch.mockReturnValue(expected);

      const actual = await client.fetch(document, variables);

      expect(actual).toBe(expected);
      expect(mockBaseClientFetch).toBeCalledWith(document, variables);
    });

    it('should make request with access token if user logged in', async () => {
      const accessToken = '123123';
      mockFirebaseAuth.mockReturnValue({
        currentUser: {
          getIdToken: async () => accessToken,
        },
      });

      await client.fetch(document, variables);

      expect(mockBaseClientSetHeader).toBeCalledWith(
        'authorization',
        'Bearer 123123'
      );
    });

    it('should make request without access token if user not logged in', async () => {
      mockFirebaseAuth.mockReturnValue({
        currentUser: null,
      });

      await client.fetch(document, variables);

      expect(mockBaseClientSetHeader).not.toBeCalled();
    });

    it('should make request without access token if Firebase auth fails', async () => {
      mockFirebaseAuth.mockImplementation(() => {
        throw new Error();
      });

      await client.fetch(document, variables);

      expect(mockBaseClientSetHeader).not.toBeCalled();
    });
  });
});
