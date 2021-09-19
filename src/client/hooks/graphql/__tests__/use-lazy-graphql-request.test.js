import { renderHook, act } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import useGraphQLFetcherContext from '../use-graphql-fetcher';
import useLazyGraphQLRequest from '../use-lazy-graphql-request';

jest.mock('../use-graphql-fetcher');

describe('useLazyGraphQLRequest', () => {
  let mockFetch;

  let document;
  let variables;

  beforeEach(() => {
    mockFetch = jest.fn();
    useGraphQLFetcherContext.mockReturnValue(mockFetch);

    document = 'graphql-document';
    variables = {
      name: 'name',
    };
  });

  afterEach(() => {
    useGraphQLFetcherContext.mockReset();
  });

  it('should return uninitialized state when uninitialized', () => {
    const { result } = renderHook(() => useLazyGraphQLRequest(document));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isInitialized).toBeFalsy();
  });

  describe('on successful execute', () => {
    let data;

    beforeEach(() => {
      data = {
        message: 'some data',
      };
      when(mockFetch).calledWith(document, variables).mockReturnValue(data);
    });

    it('should set data', async () => {
      const { result } = renderHook(() => useLazyGraphQLRequest(document));

      await act(async () => {
        await result.current.execute(variables);
      });

      expect(result.current.data).toBe(data);
    });

    it('should return data', async () => {
      const { result } = renderHook(() => useLazyGraphQLRequest(document));

      await act(async () => {
        const { data: responseData } = await result.current.execute(variables);
        expect(responseData).toBe(data);
      });
    });

    it('should set initialized', async () => {
      const { result } = renderHook(() => useLazyGraphQLRequest(document));

      await act(async () => {
        await result.current.execute(variables);
      });

      expect(result.current.isInitialized).toBe(true);
    });
  });

  describe('on failed execute', () => {
    let error;

    beforeEach(() => {
      error = new Error('Error message');
      when(mockFetch)
        .calledWith(document, variables)
        .mockImplementation(() => {
          throw error;
        });
    });

    it('should set error', async () => {
      const { result } = renderHook(() => useLazyGraphQLRequest(document));

      await act(async () => {
        await result.current.execute(variables);
      });

      expect(result.current.error).toBe(error);
    });

    it('should return error', async () => {
      const { result } = renderHook(() => useLazyGraphQLRequest(document));

      await act(async () => {
        const { error: responseError } = await result.current.execute(
          variables
        );
        expect(responseError).toBe(error);
      });
    });

    it('should set initialized', async () => {
      const { result } = renderHook(() => useLazyGraphQLRequest(document));

      await act(async () => {
        await result.current.execute(variables);
      });

      expect(result.current.isInitialized).toBe(true);
    });
  });
});
