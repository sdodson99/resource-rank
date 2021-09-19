import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import { when } from 'jest-when';
import TopicDetails, { getServerSideProps } from '../index.page';
import useTopicResourceSearch from '@/hooks/topics/use-topic-resource-search';
import withApp from '@/test-utils/with-app';

jest.mock('@/services/topics/graphql-topic-by-slug-service');
jest.mock('@/hooks/topics/use-topic-resource-search');

describe('<TopicDetails />', () => {
  describe('page', () => {
    let mockTopicResourceSearch;

    let props;

    beforeEach(() => {
      mockTopicResourceSearch = {
        data: {},
        error: new Error(),
        isLoading: true,
        isInitialized: true,
        searchVariables: { resourceSearch: 'search' },
        currentSearchVariables: { resourceSearch: 'currentSearch', limit: 10 },
        debounceProcessSearch: jest.fn(),
        currentPage: 1,
        processPageNumber: jest.fn(),
      };
      useTopicResourceSearch.mockReturnValue(mockTopicResourceSearch);

      props = {
        topicId: '123',
        topicName: 'name',
        topicSlug: 'slug',
        topicCreator: 'creator',
      };
    });

    afterEach(() => {
      useTopicResourceSearch.mockReset();
    });

    it('should mount', () => {
      render(withApp(TopicDetails, props));

      const page = screen.getByTestId('TopicsDetails');

      expect(page).toBeInTheDocument();
    });

    describe('new topic alert', () => {
      it('should display new topic alert when isNew is true', () => {
        props.isNew = true;
        render(withApp(TopicDetails, props));

        const alert = screen.getByTestId('InfoAlert');

        expect(alert).toBeInTheDocument();
      });

      it('should not display new topic alert when isNew is not true', () => {
        props.isNew = false;
        render(withApp(TopicDetails, props));

        const alert = screen.queryByTestId('InfoAlert');

        expect(alert).not.toBeInTheDocument();
      });
    });

    it('should render correctly', () => {
      const page = renderer.create(withApp(TopicDetails, props)).toJSON();

      expect(page).toMatchSnapshot();
    });

    it('should render correctly when topic verified', () => {
      props.topicVerified = true;

      const page = renderer.create(withApp(TopicDetails, props)).toJSON();

      expect(page).toMatchSnapshot();
    });

    it('should show loading when topic resources initializing', () => {
      useTopicResourceSearch.mockReturnValue({
        ...mockTopicResourceSearch,
        isInitialized: false,
      });
      render(withApp(TopicDetails, props));

      const loadingSpinner = screen.getByTestId('LoadingSpinner');

      expect(loadingSpinner).toBeInTheDocument();
    });

    it('should render correctly with data', () => {
      useTopicResourceSearch.mockReturnValue({
        ...mockTopicResourceSearch,
        data: {
          topicResources: {
            items: [
              {
                resource: {
                  id: '1',
                  slug: 'slug-1',
                },
                ratingList: {
                  average: 5,
                },
              },
              {
                resource: {
                  id: '2',
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
      });

      const page = renderer.create(withApp(TopicDetails, props)).toJSON();

      expect(page).toMatchSnapshot();
    });

    it('should process search on search input', () => {
      const search = '123';
      render(withApp(TopicDetails, props));
      const searchInput = screen.getByTestId('SearchInput');

      fireEvent.input(searchInput, {
        target: {
          value: search,
        },
      });

      expect(mockTopicResourceSearch.debounceProcessSearch).toBeCalledWith({
        resourceSearch: search,
        offset: 0,
        limit: 10,
      });
    });

    it('should render correctly with no data and no current search', () => {
      useTopicResourceSearch.mockReturnValue({
        ...mockTopicResourceSearch,
        currentSearchVariables: {},
      });

      const page = renderer.create(withApp(TopicDetails, props)).toJSON();

      expect(page).toMatchSnapshot();
    });
  });

  describe('getServerSideProps', () => {
    let req;
    let params;
    let query;
    let topicSlug;
    let mock;

    beforeEach(() => {
      topicSlug = 'topic-name';
      mock = 'mock';

      req = {};
      params = {
        topicSlug,
      };
      query = {
        mock,
      };
    });

    afterEach(() => {
      getTopicBySlug.mockReset();
    });

    it('should return not found if topic query fails', async () => {
      when(getTopicBySlug)
        .calledWith(topicSlug, { mock })
        .mockImplementation(() => {
          throw new Error();
        });

      const { notFound } = await getServerSideProps({ req, params, query });

      expect(notFound).toBeTruthy();
    });

    describe('when successful', () => {
      let id;
      let name;
      let slug;
      let creator;
      let verified;

      beforeEach(() => {
        id = '123';
        name = 'name';
        slug = 'slug';
        creator = 'creator';
        verified = true;
      });

      it('should return topic props', async () => {
        when(getTopicBySlug)
          .calledWith(topicSlug, { mock })
          .mockReturnValue({
            id,
            name,
            slug,
            verified,
            createdBy: {
              username: creator,
            },
          });

        const { props } = await getServerSideProps({ req, params, query });

        expect(props).toEqual({
          topicId: id,
          topicName: name,
          topicSlug: slug,
          topicCreator: creator,
          topicVerified: verified,
          isNew: false,
        });
      });

      it('should return unknown creator if topic creator does not exist', async () => {
        when(getTopicBySlug).calledWith(topicSlug, { mock }).mockReturnValue({
          id,
          name,
          slug,
        });

        const {
          props: { topicCreator },
        } = await getServerSideProps({ req, params, query });

        expect(topicCreator).toBe('Unknown');
      });

      it('should return isNew if topic is new', async () => {
        when(getTopicBySlug)
          .calledWith(topicSlug, { mock })
          .mockReturnValue({});
        query.new = 'true';

        const {
          props: { isNew },
        } = await getServerSideProps({
          req,
          params,
          query,
        });

        expect(isNew).toBeTruthy();
      });
    });
  });
});
