import { useState } from 'react';
import useGraphQLFetcherContext from '../use-graphql-fetcher';
import useLazyGraphQLRequest from '../use-lazy-graphql-request';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
jest.mock('../use-graphql-fetcher');

describe('useLazyGraphQLRequest', () => {
  let mockFetch;

  let document;
  let variables;

  beforeEach(() => {
    useState.mockReturnValue([null, jest.fn()]);

    mockFetch = jest.fn();
    useGraphQLFetcherContext.mockReturnValue(mockFetch);

    document = 'graphql-document';
    variables = {
      name: 'name',
    };
  });

  afterEach(() => {
    useState.mockReset();
    useGraphQLFetcherContext.mockReset();
  });

  it('should return request state', () => {
    const expectedData = { name: 'name' };
    const expectedError = { message: 'error' };
    const expectedIsLoading = true;
    useState.mockReturnValueOnce([expectedData]);
    useState.mockReturnValueOnce([expectedError]);
    useState.mockReturnValueOnce([expectedIsLoading]);

    const {
      data: actualData,
      error: actualError,
      isLoading: actualIsLoading,
    } = useLazyGraphQLRequest(document);

    expect(actualData).toBe(expectedData);
    expect(actualError).toBe(expectedError);
    expect(actualIsLoading).toBe(expectedIsLoading);
  });

  describe('on successful execute', () => {
    let data;

    beforeEach(() => {
      data = {
        message: 'some data',
      };
      mockFetch.mockReturnValue(data);
    });

    it('should set data on successful execute', async () => {
      const mockSetData = jest.fn();
      useState.mockReturnValueOnce([null, mockSetData]);

      const { execute } = useLazyGraphQLRequest(document);
      await execute(variables);

      expect(mockSetData).toBeCalledWith(data);
    });

    it('should return data', async () => {
      const { execute } = useLazyGraphQLRequest(document);
      const { data: actualData } = await execute(variables);

      expect(actualData).toBe(data);
    });

    it('should toggle loading', async () => {
      const mockSetIsLoading = jest.fn();
      useState.mockReturnValueOnce([null, jest.fn()]);
      useState.mockReturnValueOnce([null, jest.fn()]);
      useState.mockReturnValueOnce([null, mockSetIsLoading]);

      const { execute } = useLazyGraphQLRequest(document);
      await execute(variables);

      expect(mockSetIsLoading).toBeCalledWith(true);
      expect(mockSetIsLoading).toBeCalledWith(false);
    });
  });

  describe('on failed execute', () => {
    let error;

    beforeEach(() => {
      error = new Error('Error message');
      mockFetch.mockImplementation(() => {
        throw error;
      });
    });

    it('should set error', async () => {
      const mockSetError = jest.fn();
      useState.mockReturnValueOnce([null, jest.fn()]);
      useState.mockReturnValueOnce([null, mockSetError]);

      const { execute } = useLazyGraphQLRequest(document);
      await execute(variables);

      expect(mockSetError).toBeCalledWith(error);
    });

    it('should return error', async () => {
      const { execute } = useLazyGraphQLRequest(document);
      const { error: actualError } = await execute(variables);

      expect(actualError).toBe(error);
    });

    it('should toggle loading', async () => {
      const mockSetIsLoading = jest.fn();
      useState.mockReturnValueOnce([null, jest.fn()]);
      useState.mockReturnValueOnce([null, jest.fn()]);
      useState.mockReturnValueOnce([null, mockSetIsLoading]);

      const { execute } = useLazyGraphQLRequest(document);
      await execute(variables);

      expect(mockSetIsLoading).toBeCalledWith(true);
      expect(mockSetIsLoading).toBeCalledWith(false);
    });
  });
});
