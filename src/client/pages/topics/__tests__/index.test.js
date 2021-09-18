import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import Topics from '../index.page';
import { useRouter } from 'next/router';
import useTopicSearch from '@/hooks/topics/use-topic-search';
import withApp from '@/test-utils/with-app';

jest.mock('next/router');
jest.mock('@/hooks/topics/use-topic-search');

describe('<Topics />', () => {
  let searchQuery;
  let mockTopicSearch;

  beforeEach(() => {
    searchQuery = 'search';
    useRouter.mockReturnValue({
      query: {
        q: searchQuery,
      },
    });

    mockTopicSearch = {
      data: {
        topics: {
          items: [
            {
              id: '1',
              name: 'name',
              slug: 'slug',
            },
            {
              id: '2',
              name: 'name',
            },
          ],
        },
      },
      error: null,
      isLoading: false,
      searchVariables: { search: 'search' },
      currentSearchVariables: { search: 'currentSearch', limit: 10 },
      debounceProcessSearch: jest.fn(),
      currentPage: 1,
      processPageNumber: jest.fn(),
    };
    useTopicSearch.mockReturnValue(mockTopicSearch);
  });

  afterEach(() => {
    useRouter.mockReset();
    useTopicSearch.mockReset();
  });

  it('should mount', () => {
    render(withApp(Topics));

    const page = screen.getByTestId('Topics');

    expect(page).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const page = renderer.create(withApp(Topics)).toJSON();

    expect(page).toMatchSnapshot();
  });

  it('should render correctly with no current search', () => {
    useRouter.mockReturnValue({ query: {} });
    mockTopicSearch.currentSearchVariables = {};
    mockTopicSearch.data = {};
    useTopicSearch.mockReturnValue(mockTopicSearch);

    const page = renderer.create(withApp(Topics)).toJSON();

    expect(page).toMatchSnapshot();
  });

  it('should process search on search input', () => {
    const search = '123';
    render(withApp(Topics));
    const searchInput = screen.getByTestId('SearchInput');

    fireEvent.input(searchInput, {
      target: {
        value: search,
      },
    });

    expect(mockTopicSearch.debounceProcessSearch).toBeCalledWith({
      search,
      offset: 0,
      limit: 10,
    });
  });
});
