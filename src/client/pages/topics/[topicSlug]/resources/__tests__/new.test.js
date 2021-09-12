/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import { when } from 'jest-when';
import NewTopicResource, { Page, getServerSideProps } from '../new.page';
import useResourceCreator from '@/hooks/resources/use-resource-creator';
import useTopicResourceCreator from '@/hooks/topics/use-topic-resource-creator';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import ResourceExistsError from '@/errors/resource-exists-error';
import { useIntersectionObserver } from 'react-intersection-observer-hook';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
jest.mock('next/router');
jest.mock('@/hooks/resources/use-resource-creator');
jest.mock('@/hooks/topics/use-topic-resource-creator');
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));
jest.mock(
  '@/components/ResourceDetailsForm/ResourceDetailsForm',
  () =>
    ({ onSubmit, onInvalid }) =>
      (
        <div>
          <button
            onClick={() => onSubmit({ name: 'name', link: 'link' })}
            data-testid="SubmitButton"
          >
            Submit
          </button>
          <button onClick={onInvalid} data-testid="InvalidButton">
            Invalid
          </button>
        </div>
      )
);
jest.mock('@/services/topics/graphql-topic-by-slug-service');
jest.mock('react-intersection-observer-hook');
useIntersectionObserver.mockReturnValue([createRef(), {}]);

describe('<NewTopicResource />', () => {
  describe('page', () => {
    let topicId;
    let topicName;
    let topicSlug;
    let props;

    beforeEach(() => {
      useRouter.mockReturnValue({});
      useForm.mockReturnValue({});
      useResourceCreator.mockReturnValue({});
      useTopicResourceCreator.mockReturnValue({});
      useState.mockReturnValue([null, jest.fn()]);

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
      useState.mockReset();
      useRouter.mockReset();
      useForm.mockReset();
      useTopicResourceCreator.mockReset();
      useResourceCreator.mockReset();
    });

    it('should mount', () => {
      render(<Page {...props} />);

      const page = screen.getByTestId('NewTopicResourcePage');

      expect(page).toBeInTheDocument();
    });

    describe('on valid submit', () => {
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
        const mockPush = jest.fn();
        useRouter.mockReturnValue({
          push: mockPush,
        });
        mockCreateResource.mockReturnValue({
          id: resourceId,
          slug: resourceSlug,
        });
        mockCreateTopicResource.mockReturnValue(true);
        render(<Page {...props} />);
        const submitButton = screen.getByTestId('SubmitButton');

        submitButton.click();

        await waitFor(() => {
          expect(mockPush).toBeCalledWith(
            '/topics/topic-slug/resources/resource-slug?new=true'
          );
        });
      });

      it('should set create topic resource error if failed to create topic resource', async () => {
        const mockSetCreateTopicResourceError = jest.fn();
        useState.mockReturnValueOnce([null, jest.fn()]);
        useState.mockReturnValueOnce([null, mockSetCreateTopicResourceError]);
        mockCreateResource.mockReturnValue({
          id: resourceId,
          slug: resourceSlug,
        });
        mockCreateTopicResource.mockReturnValue(false);
        render(<Page {...props} />);
        const submitButton = screen.getByTestId('SubmitButton');

        submitButton.click();

        await waitFor(() => {
          expect(mockSetCreateTopicResourceError).toBeCalled();
        });
      });

      it('should set name exists error if resource name already exists', async () => {
        const mockSetError = jest.fn();
        useForm.mockReturnValue({
          setError: mockSetError,
        });
        mockCreateResource.mockImplementation(() => {
          throw new ResourceExistsError();
        });
        render(<Page {...props} />);
        const submitButton = screen.getByTestId('SubmitButton');

        submitButton.click();

        await waitFor(() => {
          expect(mockSetError).toBeCalledWith('name', {
            message: 'Name already exists.',
          });
        });
      });

      it('should set create resource error if failed to create resource', async () => {
        const mockSetCreateResourceError = jest.fn();
        useState.mockReturnValueOnce([null, mockSetCreateResourceError]);
        mockCreateResource.mockImplementation(() => {
          throw new Error();
        });
        render(<Page {...props} />);
        const submitButton = screen.getByTestId('SubmitButton');

        submitButton.click();

        await waitFor(() => {
          expect(mockSetCreateResourceError).toBeCalled();
        });
      });

      it('should set is creating resource to true', async () => {
        const mockSetIsCreatingResource = jest.fn();
        useState.mockReturnValueOnce([null, jest.fn()]);
        useState.mockReturnValueOnce([null, jest.fn()]);
        useState.mockReturnValueOnce([null, mockSetIsCreatingResource]);
        mockCreateResource.mockImplementation(() => {
          throw new Error();
        });
        render(<Page {...props} />);
        const submitButton = screen.getByTestId('SubmitButton');

        submitButton.click();

        await waitFor(() => {
          expect(mockSetIsCreatingResource).toBeCalledWith(true);
        });
      });

      it('should set is creating resource to false on error', async () => {
        const mockSetIsCreatingResource = jest.fn();
        useState.mockReturnValueOnce([null, jest.fn()]);
        useState.mockReturnValueOnce([null, jest.fn()]);
        useState.mockReturnValueOnce([null, mockSetIsCreatingResource]);
        mockCreateResource.mockImplementation(() => {
          throw new Error();
        });
        render(<Page {...props} />);
        const submitButton = screen.getByTestId('SubmitButton');

        submitButton.click();

        await waitFor(() => {
          expect(mockSetIsCreatingResource).toBeCalledWith(false);
        });
      });
    });

    it('should clear generic error on invalid submit', () => {
      const mockSetCreateResourceError = jest.fn();
      const mockSetCreateTopicResourceError = jest.fn();
      useState.mockReturnValueOnce([new Error(), mockSetCreateResourceError]);
      useState.mockReturnValueOnce([
        new Error(),
        mockSetCreateTopicResourceError,
      ]);
      render(<Page {...props} />);
      const invalidButton = screen.getByTestId('InvalidButton');

      invalidButton.click();

      expect(mockSetCreateResourceError).toBeCalledWith(null);
      expect(mockSetCreateTopicResourceError).toBeCalledWith(null);
    });

    it('should render correctly', () => {
      const page = createRenderer().render(<Page {...props} />);

      expect(page).toMatchSnapshot();
    });

    it('should render correctly with create errors', () => {
      useState.mockReturnValueOnce([new Error(), jest.fn()]);
      useState.mockReturnValueOnce([new Error(), jest.fn()]);

      const page = createRenderer().render(<Page {...props} />);

      expect(page).toMatchSnapshot();
    });
  });

  describe('HOC page', () => {
    it('should require authentication', () => {
      const page = createRenderer().render(<NewTopicResource />);

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
