import React, { useState, useEffect } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import { when } from 'jest-when';
import AddTopicResource, { getServerSideProps } from '../add.page';
import { useRouter } from 'next/router';
import useAvailableTopicResourceSearch from '@/hooks/topics/use-available-topic-resource-search';
import useTopicResourceCreator from '@/hooks/topics/use-topic-resource-creator';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
jest.mock('@/services/topics/graphql-topic-by-slug-service');
jest.mock('next/router');
jest.mock('@/hooks/topics/use-available-topic-resource-search');
jest.mock('@/hooks/topics/use-topic-resource-creator');

describe('<AddTopicResource />', () => {
  describe('page', () => {
    let topicId;
    let topicName;
    let topicSlug;
    let props;

    let mockAvailableTopicResourceSearch;

    beforeEach(() => {
      useState.mockReturnValue([null, jest.fn()]);

      mockAvailableTopicResourceSearch = {
        data: {},
        error: null,
        isLoading: false,
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
      useEffect.mockReset();
      useState.mockReset();
      useRouter.mockReset();
      useAvailableTopicResourceSearch.mockReset();
      useTopicResourceCreator.mockReset();
    });

    it('should mount', () => {
      render(<AddTopicResource {...props} />);

      const page = screen.getByTestId('AddTopicResourcePage');

      expect(page).toBeInTheDocument();
    });

    it('should process search on search input', () => {
      const search = '123';
      render(<AddTopicResource {...props} />);
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

    it('should set resources when available resources data changes', () => {
      const mockSetResources = jest.fn();
      useState.mockReturnValueOnce([null, mockSetResources]);
      useEffect.mockImplementationOnce((cb) => cb());
      const expected = [
        {
          slug: 'slug',
          alreadyAdded: true,
        },
      ];
      mockAvailableTopicResourceSearch.data = {
        availableResources: {
          items: [
            {
              resource: {
                slug: 'slug',
              },
              alreadyAdded: true,
            },
          ],
        },
      };
      useAvailableTopicResourceSearch.mockReturnValue(
        mockAvailableTopicResourceSearch
      );

      render(<AddTopicResource {...props} />);

      expect(mockSetResources).toBeCalledWith(expected);
    });

    describe('onAddResource', () => {
      let mockCreate;
      let mockSetResources;

      let resourceId;
      let resourceSlug;

      beforeEach(() => {
        mockCreate = jest.fn();
        useTopicResourceCreator.mockReturnValue({
          createTopicResource: mockCreate,
        });

        resourceId = '789';
        resourceSlug = 'resource-slug';
        mockSetResources = jest.fn();
        useState.mockReturnValueOnce([
          [{ id: resourceId, slug: resourceSlug }],
          mockSetResources,
        ]);
      });

      it('should renavigate to new topic resource if successful', async () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({
          push: mockPush,
        });
        when(mockCreate).calledWith(topicId, resourceId).mockReturnValue(true);
        render(<AddTopicResource {...props} />);
        const addResourceButton = screen.getByTestId('AddResourceButton');

        addResourceButton.click();

        await waitFor(() => {
          expect(mockPush).toBeCalledWith(
            '/topics/topic-slug/resources/resource-slug?new=true'
          );
        });
      });

      it('should set resource error if not successful', async () => {
        when(mockCreate).calledWith(topicId, resourceId).mockReturnValue(false);
        render(<AddTopicResource {...props} />);
        const addResourceButton = screen.getByTestId('AddResourceButton');

        addResourceButton.click();

        await waitFor(() => {
          expect(mockSetResources).toBeCalledWith([
            { id: resourceId, slug: resourceSlug, hasAddError: true },
          ]);
        });
      });
    });

    it('should render correctly', () => {
      const page = createRenderer().render(<AddTopicResource {...props} />);

      expect(page).toMatchSnapshot();
    });

    it('should render correctly with current search', () => {
      mockAvailableTopicResourceSearch.currentSearchVariables = {
        search: 'currentSearch',
      };
      useAvailableTopicResourceSearch.mockReturnValue(
        mockAvailableTopicResourceSearch
      );

      const page = createRenderer().render(<AddTopicResource {...props} />);

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

      beforeEach(() => {
        id = '123';
        name = 'name';
        slug = 'slug';
      });

      it('should return topic props', async () => {
        when(getTopicBySlug).calledWith(topicSlug).mockReturnValue({
          id,
          name,
          slug,
        });

        const { props } = await getServerSideProps({ req, params });

        expect(props).toEqual({
          topicId: id,
          topicName: name,
          topicSlug: slug,
        });
      });
    });
  });
});
