import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import Topics from '../index.page';
import { useRouter } from 'next/router';
import useAuthenticationState from '@/hooks/use-authentication-context';
import useTopicSearch from '@/hooks/topics/use-topic-search';

jest.mock('next/router');
jest.mock('@/hooks/use-authentication-context');
jest.mock('@/hooks/topics/use-topic-search');

describe('<Topics />', () => {
  let searchQuery;
  let mockProcessSearch;

  beforeEach(() => {
    searchQuery = 'search';
    useRouter.mockReturnValue({
      query: {
        q: searchQuery,
      },
    });

    useAuthenticationState.mockReturnValue({ isLoggedIn: false });

    mockProcessSearch = jest.fn();
    useTopicSearch.mockReturnValue({
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
      search: '',
      currentSearch: '',
      processSearch: mockProcessSearch,
    });
  });

  afterEach(() => {
    useRouter.mockReset();
    useAuthenticationState.mockReset();
    useTopicSearch.mockReset();
  });

  it('should mount', () => {
    render(<Topics />);

    const page = screen.getByTestId('Topics');

    expect(page).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const page = createRenderer().render(<Topics />);

    expect(page).toMatchSnapshot();
  });

  it('should process search on search input', () => {
    const search = '123';
    render(<Topics />);
    const searchInput = screen.getByTestId('SearchInput');

    fireEvent.input(searchInput, {
      target: {
        value: search,
      },
    });

    expect(mockProcessSearch).toBeCalledWith(search);
  });
});
