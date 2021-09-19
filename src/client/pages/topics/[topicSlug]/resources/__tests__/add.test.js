import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import { when } from 'jest-when';
import AddTopicResource, { Page, getServerSideProps } from '../add.page';
import useNavigate from '@/hooks/use-navigate';
import useAvailableTopicResourceSearch from '@/hooks/topics/use-available-topic-resource-search';
import useTopicResourceCreator from '@/hooks/topics/use-topic-resource-creator';
import withApp from '@/test-utils/with-app';

jest.mock('@/services/topics/graphql-topic-by-slug-service');
jest.mock('@/hooks/use-navigate');
jest.mock('@/hooks/topics/use-available-topic-resource-search');
jest.mock('@/hooks/topics/use-topic-resource-creator');

describe('<AddTopicResource />', () => {
  describe('page', () => {
    let topicId;
    let topicName;
    let topicSlug;
    let props;

    let mockAvailableTopicResourceSearch;
    let mockNavigate;

    beforeEach(() => {
      mockAvailableTopicResourceSearch = {
        data: {
          availableResources: {
            items: [
              {
                resource: {
                  id: '1',
                  slug: 'slug-1',
                },
                alreadyAdded: false,
              },
              {
                resource: {
                  id: '2',
                  slug: 'slug-2',
                },
                alreadyAdded: true,
              },
            ],
          },
        },
        error: null,
        isLoading: false,
        isInitialized: true,
        searchVariables: { search: 'search' },
        currentSearchVariables: { search: null, limit: 10 },
        debounceProcessSearch: jest.fn(),
        currentPage: 1,
        processPageNumber: jest.fn(),
      };
      useAvailableTopicResourceSearch.mockReturnValue(
        mockAvailableTopicResourceSearch
      );
      useTopicResourceCreator.mockReturnValue({});

      mockNavigate = jest.fn();
      useNavigate.mockReturnValue(mockNavigate);

      topicId = '123';
      topicName = 'topic-name';
      topicSlug = 'topic-slug';
      props = {
        topicId,
        topicName,
        topicSlug,
      };
    });

    afterEach(() => {
      useNavigate.mockReset();
      useAvailableTopicResourceSearch.mockReset();
      useTopicResourceCreator.mockReset();
    });

    it('should mount', () => {
      render(withApp(Page, props));

      const page = screen.getByTestId('AddTopicResourcePage');

      expect(page).toBeInTheDocument();
    });

    it('should process search on search input', () => {
      const search = '123';
      render(withApp(Page, props));
      const searchInput = screen.getByTestId('SearchInput');

      fireEvent.input(searchInput, {
        target: {
          value: search,
        },
      });

      expect(
        mockAvailableTopicResourceSearch.debounceProcessSearch
      ).toBeCalledWith({
        search,
        offset: 0,
        limit: 10,
      });
    });

    it('should show resources when available resources data loads', async () => {
      render(withApp(Page, props));

      await waitFor(() => {
        const availableResourceListingItems = screen.getAllByTestId(
          'AvailableResourceListingItem'
        );
        expect(availableResourceListingItems.length).toBe(2);
      });
    });

    it('should show loading when topic resources initializing', () => {
      useAvailableTopicResourceSearch.mockReturnValue({
        ...mockAvailableTopicResourceSearch,
        isInitialized: false,
      });
      render(withApp(Page, props));

      const loadingDisplay = screen.getByTestId('SkeletonListing');

      expect(loadingDisplay).toBeInTheDocument();
    });

    describe('onAddResource', () => {
      function renderAndSubmit() {
        render(withApp(Page, props));

        const addResourceButton = screen.getAllByTestId('AddResourceButton')[0];
        addResourceButton.click();
      }

      let mockCreate;
      let resourceId;

      beforeEach(() => {
        mockCreate = jest.fn();
        useTopicResourceCreator.mockReturnValue({
          createTopicResource: mockCreate,
        });

        resourceId = '1';
      });

      it('should renavigate to new topic resource if successful', async () => {
        when(mockCreate).calledWith(topicId, resourceId).mockReturnValue(true);

        renderAndSubmit();

        await waitFor(() => {
          expect(mockNavigate).toBeCalledWith({
            pathname: `/topics/topic-slug/resources/slug-1`,
            query: {
              new: true,
            },
          });
        });
      });

      it('should display resource error if not successful', async () => {
        when(mockCreate).calledWith(topicId, resourceId).mockReturnValue(false);

        renderAndSubmit();

        await waitFor(() => {
          const errorMessage = screen.getByText(
            'Failed to add topic resource.'
          );
          expect(errorMessage).toBeInTheDocument();
        });
      });

      it('should clear resource error if successful', async () => {
        when(mockCreate).calledWith(topicId, resourceId).mockReturnValue(false);
        renderAndSubmit();
        await waitFor(() => {
          const errorMessage = screen.getByText(
            'Failed to add topic resource.'
          );
          expect(errorMessage).toBeInTheDocument();
        });
        when(mockCreate).calledWith(topicId, resourceId).mockReturnValue(true);

        renderAndSubmit();

        await waitFor(() => {
          const errorMessage = screen.queryByText(
            'Failed to add topic resource.'
          );
          expect(errorMessage).toBeNull();
        });
      });
    });

    it('should render correctly', () => {
      const page = renderer.create(withApp(Page, props)).toJSON();

      expect(page).toMatchSnapshot();
    });

    it('should render correctly with current search', () => {
      mockAvailableTopicResourceSearch.currentSearchVariables = {
        search: 'currentSearch',
      };
      useAvailableTopicResourceSearch.mockReturnValue(
        mockAvailableTopicResourceSearch
      );

      const page = renderer.create(withApp(Page, props)).toJSON();

      expect(page).toMatchSnapshot();
    });
  });

  describe('HOC page', () => {
    it('should require authentication', () => {
      const page = renderer
        .create(withApp(AddTopicResource, {}, { mock: 'unauthenticated' }))
        .toJSON();

      expect(page).toMatchSnapshot();
    });
  });

  describe('getServerSideProps', () => {
    let req;
    let params;
    let query;
    let mock;
    let topicSlug;

    beforeEach(() => {
      mock = 'mock';
      query = {
        mock,
      };
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

      beforeEach(() => {
        id = '123';
        name = 'name';
        slug = 'slug';
      });

      it('should return topic props', async () => {
        when(getTopicBySlug).calledWith(topicSlug, { mock }).mockReturnValue({
          id,
          name,
          slug,
        });

        const { props } = await getServerSideProps({ req, params, query });

        expect(props).toEqual({
          topicId: id,
          topicName: name,
          topicSlug: slug,
        });
      });
    });
  });
});
