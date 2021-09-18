import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import { when } from 'jest-when';
import NewTopicResource, { Page, getServerSideProps } from '../new.page';
import useResourceCreator from '@/hooks/resources/use-resource-creator';
import useTopicResourceCreator from '@/hooks/topics/use-topic-resource-creator';
import useNavigate from '@/hooks/use-navigate';
import ResourceExistsError from '@/errors/resource-exists-error';
import withApp from '@/test-utils/with-app';
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';

jest.mock('@/hooks/use-navigate');
jest.mock('@/hooks/resources/use-resource-creator');
jest.mock('@/hooks/topics/use-topic-resource-creator');
jest.mock('@/services/topics/graphql-topic-by-slug-service');

describe('<NewTopicResource />', () => {
  describe('page', () => {
    let topicId;
    let topicName;
    let topicSlug;
    let props;

    beforeEach(() => {
      useResourceCreator.mockReturnValue({});
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
      useNavigate.mockReset();
      useTopicResourceCreator.mockReset();
      useResourceCreator.mockReset();
    });

    it('should mount', () => {
      render(withApp(Page, props));

      const page = screen.getByTestId('NewTopicResourcePage');

      expect(page).toBeInTheDocument();
    });

    describe('on valid submit', () => {
      function submitForm() {
        const submitButton = screen.getByText('Submit');
        submitButton.click();
      }

      function renderAndSubmit() {
        render(withApp(Page, props));

        userEvent.type(screen.getByLabelText('Name'), 'name');
        userEvent.type(screen.getByLabelText('Link'), 'test.com');

        submitForm();
      }

      let mockCreateResource;
      let mockCreateTopicResource;

      let resourceId;
      let resourceSlug;

      beforeEach(() => {
        mockCreateResource = jest.fn();
        useResourceCreator.mockReturnValue({
          createResource: mockCreateResource,
        });

        mockCreateTopicResource = jest.fn();
        useTopicResourceCreator.mockReturnValue({
          createTopicResource: mockCreateTopicResource,
        });

        resourceId = '789';
        resourceSlug = 'resource-slug';
      });

      it('should renavigate to created topic resource if successful', async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        mockCreateResource.mockReturnValue({
          id: resourceId,
          slug: resourceSlug,
        });
        mockCreateTopicResource.mockReturnValue(true);

        renderAndSubmit();

        await waitFor(() => {
          expect(mockNavigate).toBeCalledWith({
            pathname: `/topics/topic-slug/resources/resource-slug`,
            query: {
              new: true,
            },
          });
        });
      });

      it('should display create topic resource error if failed to create topic resource', async () => {
        mockCreateResource.mockReturnValue({
          id: resourceId,
          slug: resourceSlug,
        });
        mockCreateTopicResource.mockReturnValue(false);

        renderAndSubmit();

        await waitFor(() => {
          const errorMessage = screen.getByText(
            'Failed to create topic resource.'
          );
          expect(errorMessage).toBeInTheDocument();
        });
      });

      it('should set name exists error if resource name already exists', async () => {
        mockCreateResource.mockImplementation(() => {
          throw new ResourceExistsError();
        });
        renderAndSubmit();

        await waitFor(() => {
          const errorMessage = screen.getByText('Name already exists.');
          expect(errorMessage).toBeInTheDocument();
        });
      });

      it('should set create resource error if failed to create resource', async () => {
        mockCreateResource.mockImplementation(() => {
          throw new Error();
        });

        renderAndSubmit();

        await waitFor(() => {
          const errorMessage = screen.getByText('Failed to create resource.');
          expect(errorMessage).toBeInTheDocument();
        });
      });

      it('should clear generic error on invalid submit', async () => {
        mockCreateResource.mockReturnValue({
          id: resourceId,
          slug: resourceSlug,
        });
        mockCreateTopicResource.mockReturnValue(false);
        renderAndSubmit();
        await waitFor(() => {
          const errorMessage = screen.getByText(
            'Failed to create topic resource.'
          );
          expect(errorMessage).toBeInTheDocument();
        });
        mockCreateTopicResource.mockReturnValue(true);

        submitForm();

        await waitFor(() => {
          const errorMessage = screen.queryByText(
            'Failed to create topic resource.'
          );
          expect(errorMessage).toBeNull();
        });
      });
    });

    it('should render correctly', () => {
      const page = renderer.create(withApp(Page, props)).toJSON();

      expect(page).toMatchSnapshot();
    });
  });

  describe('HOC page', () => {
    it('should require authentication', () => {
      const page = renderer
        .create(withApp(NewTopicResource, {}, { mock: 'unauthenticated' }))
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
