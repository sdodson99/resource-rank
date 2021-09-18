import useSWR from 'swr';

jest.mock('swr');

beforeEach(() => {
  useSWR.mockImplementation(async (key, fetcher) => {
    const data = await fetcher(key);

    return { data };
  });
});

afterEach(() => {
  useSWR.mockReset();
});
