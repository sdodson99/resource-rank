import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import { when } from 'jest-when';
import TopicDetails, { getServerSideProps } from '../index.page';
import useAuthenticationContext from '@/hooks/use-authentication-context';
import useTopicResourceSearch from '@/hooks/topics/use-topic-resource-search';

jest.mock('@/services/topics/graphql-topic-by-slug-service');
jest.mock('@/hooks/use-authentication-context');
jest.mock('@/hooks/topics/use-topic-resource-search');

describe('<TopicDetails />', () => {
  describe('page', () => {
    let mockData;
    let mockError;
    let mockIsLoading;
    let mockSearch;
    let mockCurrentSearch;
    let mockProcessSearch;

    let props;

    beforeEach(() => {
      useAuthenticationContext.mockReturnValue({ isLoggedIn: true });

      mockData = {};
      mockError = new Error();
      mockIsLoading = true;
      mockSearch = 'search';
      mockCurrentSearch = 'currentSearch';
      mockProcessSearch = jest.fn();
      useTopicResourceSearch.mockReturnValue({
        data: mockData,
        error: mockError,
        isLoading: mockIsLoading,
        search: mockSearch,
        currentSearch: mockCurrentSearch,
        processSearch: mockProcessSearch,
      });

      props = {
        topicId: '123',
        topicName: 'name',
        topicSlug: 'slug',
        topicCreator: 'creator',
      };
    });

    afterEach(() => {
      useAuthenticationContext.mockReset();
      useTopicResourceSearch.mockReset();
    });

    it('should mount', () => {
      render(<TopicDetails {...props} />);

      const page = screen.getByTestId('TopicsDetails');

      expect(page).toBeInTheDocument();
    });

    it('should render correctly', () => {
      const page = createRenderer().render(<TopicDetails {...props} />);

      expect(page).toMatchSnapshot();
    });

    it('should render correctly when topic verified', () => {
      props.topicVerified = true;

      const page = createRenderer().render(<TopicDetails {...props} />);

      expect(page).toMatchSnapshot();
    });

    it('should render correctly with data', () => {
      useTopicResourceSearch.mockReturnValue({
        data: {
          topicResourceList: {
            topicResources: [
              {
                resource: {
                  slug: 'slug-1',
                },
                ratingList: {
                  average: 5,
                },
              },
              {
                resource: {
                  slug: 'slug-2',
                },
                ratingList: {
                  average: 1,
                },
              },
            ],
          },
        },
        error: null,
        isLoading: false,
        search: mockSearch,
        currentSearch: mockCurrentSearch,
        processSearch: mockProcessSearch,
      });

      const page = createRenderer().render(<TopicDetails {...props} />);

      expect(page).toMatchSnapshot();
    });

    it('should process search on search input', () => {
      const search = '123';
      render(<TopicDetails {...props} />);
      const searchInput = screen.getByTestId('SearchInput');

      fireEvent.input(searchInput, {
        target: {
          value: search,
        },
      });

      expect(mockProcessSearch).toBeCalledWith(search);
    });

    it('should render correctly with no data and no current search', () => {
      useTopicResourceSearch.mockReturnValue({
        data: mockData,
        error: mockError,
        isLoading: mockIsLoading,
        search: mockSearch,
        currentSearch: null,
        processSearch: mockProcessSearch,
      });

      const page = createRenderer().render(<TopicDetails {...props} />);

      expect(page).toMatchSnapshot();
    });
  });

  describe('getServerSideProps', () => {
    let req;
    let params;
    let topicSlug;

    beforeEach(() => {
      req = {};
      topicSlug = 'topic-name';
      params = {
        topicSlug,
      };
    });

    afterEach(() => {
      getTopicBySlug.mockReset();
    });

    it('should return not found if topic query fails', async () => {
      when(getTopicBySlug)
        .calledWith(topicSlug)
        .mockImplementation(() => {
          throw new Error();
        });

      const { notFound } = await getServerSideProps({ req, params });

      expect(notFound).toBeTruthy();
    });

    describe('when successful', () => {
      let id;
      let name;
      let slug;
      let creator;

      beforeEach(() => {
        id = '123';
        name = 'name';
        slug = 'slug';
        creator = 'creator';
      });

      it('should return topic props', async () => {
        when(getTopicBySlug)
          .calledWith(topicSlug)
          .mockReturnValue({
            id,
            name,
            slug,
            createdBy: {
              username: creator,
            },
          });

        const { props } = await getServerSideProps({ req, params });

        expect(props).toEqual({
          topicId: id,
          topicName: name,
          topicSlug: slug,
          topicCreator: creator,
        });
      });

      it('should return unknown creator if topic creator does not exist', async () => {
        when(getTopicBySlug).calledWith(topicSlug).mockReturnValue({
          id,
          name,
          slug,
        });

        const {
          props: { topicCreator },
        } = await getServerSideProps({ req, params });

        expect(topicCreator).toBe('Unknown');
      });
    });
  });
});
