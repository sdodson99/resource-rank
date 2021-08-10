/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import getTopicResourceBySlug from '@/services/topic-resources/graphql-topic-resource-by-slug-service';
import { when } from 'jest-when';
import TopicResourceDetails, {
  getServerSideProps,
} from '../[resourceSlug].page';
import useRatingSubmitter from '@/hooks/ratings/use-rating-submitter';
import useRating from '@/hooks/ratings/use-rating';
import useAuthenticationContext from '@/hooks/use-authentication-context';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
jest.mock('@/services/topic-resources/graphql-topic-resource-by-slug-service');
jest.mock('@/hooks/ratings/use-rating-submitter');
jest.mock('@/hooks/ratings/use-rating');
jest.mock('@/hooks/use-authentication-context');
jest.mock('@/components/RatingForm/RatingForm', () => ({ onSubmit }) => (
  <div>
    <button onClick={() => onSubmit(3)} data-testid="SubmitButton">
      Submit
    </button>
  </div>
));

describe('<TopicResourceDetails />', () => {
  describe('page', () => {
    let mockSubmitRating;
    let mockIsSubmittingRating;
    let mockRating;
    let mockRatingError;
    let mockIsLoadingRating;

    let topicId;
    let resourceId;
    let topicSlug;
    let resourceSlug;
    let topicResource;
    let props;

    beforeEach(() => {
      mockSubmitRating = jest.fn();
      mockIsSubmittingRating = false;
      useRatingSubmitter.mockReturnValue({
        submitRating: mockSubmitRating,
        isSubmittingRating: mockIsSubmittingRating,
      });

      mockRating = {};
      mockRatingError = null;
      mockIsLoadingRating = false;
      useRating.mockReturnValue({
        rating: mockRating,
        isLoading: mockIsLoadingRating,
        error: mockRatingError,
      });

      useState.mockReturnValue([null, jest.fn()]);

      useAuthenticationContext.mockReturnValue({ isLoggedIn: false });

      topicId = '123';
      resourceId = '456';
      topicSlug = 'topic-slug';
      resourceSlug = 'resource-slug';
      topicResource = {};
      props = {
        topicId,
        resourceId,
        topicSlug,
        resourceSlug,
        topicResource,
      };
    });

    afterEach(() => {
      useState.mockReset();
      useEffect.mockReset();
      useRating.mockReset();
      useRatingSubmitter.mockReset();
      useAuthenticationContext.mockReset();
    });

    it('should mount', () => {
      render(<TopicResourceDetails {...props} />);

      const page = screen.getByTestId('TopicResourceDetailsPage');

      expect(page).toBeInTheDocument();
    });

    it('should update existing rating on rating load', () => {
      useEffect.mockImplementationOnce((cb) => cb());
      const mockSetExistingRating = jest.fn();
      useState.mockReturnValueOnce([null, jest.fn()]);
      useState.mockReturnValueOnce([null, jest.fn()]);
      useState.mockReturnValueOnce([null, mockSetExistingRating]);
      const rating = {
        id: 789,
      };
      useRating.mockReturnValue({
        rating,
        isLoading: mockIsLoadingRating,
        error: mockRatingError,
      });

      render(<TopicResourceDetails {...props} />);

      expect(mockSetExistingRating).toBeCalledWith(rating);
    });

    describe('on submit rating', () => {
      beforeEach(() => {
        useAuthenticationContext.mockReturnValue({ isLoggedIn: true });
      });

      describe('if successful', () => {
        let submittedRating;

        beforeEach(() => {
          submittedRating = {
            value: 3,
          };
          mockSubmitRating.mockReturnValue(submittedRating);
        });

        it('should increment rating count if no existing rating', async () => {
          const mockSetRatingCount = jest.fn();
          useState.mockReturnValueOnce([null, jest.fn()]);
          useState.mockReturnValueOnce([1, mockSetRatingCount]);
          render(<TopicResourceDetails {...props} />);
          const submitButton = screen.getByTestId('SubmitButton');

          submitButton.click();

          await waitFor(() => {
            expect(mockSetRatingCount).toBeCalledWith(2);
          });
        });

        it('should update rating sum', async () => {
          const mockSetRatingSum = jest.fn();
          useState.mockReturnValueOnce([2, mockSetRatingSum]);
          useState.mockReturnValueOnce([null, jest.fn()]);
          useState.mockReturnValueOnce([{}, jest.fn()]);
          render(<TopicResourceDetails {...props} />);
          const submitButton = screen.getByTestId('SubmitButton');

          submitButton.click();

          await waitFor(() => {
            expect(mockSetRatingSum).toBeCalledWith(5);
          });
        });

        it('should update existing rating', async () => {
          const mockSetExistingRating = jest.fn();
          useState.mockReturnValueOnce([null, jest.fn()]);
          useState.mockReturnValueOnce([null, jest.fn()]);
          useState.mockReturnValueOnce([null, mockSetExistingRating]);
          render(<TopicResourceDetails {...props} />);
          const submitButton = screen.getByTestId('SubmitButton');

          submitButton.click();

          await waitFor(() => {
            expect(mockSetExistingRating).toBeCalledWith(submittedRating);
          });
        });
      });

      it('should set submit rating error if unsuccessful', async () => {
        const mockSetSubmitRatingError = jest.fn();
        useState.mockReturnValueOnce([null, jest.fn()]);
        useState.mockReturnValueOnce([null, jest.fn()]);
        useState.mockReturnValueOnce([null, jest.fn()]);
        useState.mockReturnValueOnce([null, mockSetSubmitRatingError]);
        mockSubmitRating.mockImplementation(() => {
          throw new Error();
        });
        render(<TopicResourceDetails {...props} />);
        const submitButton = screen.getByTestId('SubmitButton');

        submitButton.click();

        await waitFor(() => {
          expect(mockSetSubmitRatingError).toBeCalled();
        });
      });
    });

    it('should render correctly', () => {
      const page = createRenderer().render(<TopicResourceDetails {...props} />);

      expect(page).toMatchSnapshot();
    });

    it('should render correctly when logged in', () => {
      useAuthenticationContext.mockReturnValue({ isLoggedIn: true });

      const page = createRenderer().render(<TopicResourceDetails {...props} />);

      expect(page).toMatchSnapshot();
    });

    it('should render correctly with existing rating', () => {
      useState.mockReturnValueOnce([null, jest.fn()]);
      useState.mockReturnValueOnce([null, jest.fn()]);
      useState.mockReturnValueOnce([{ id: '789' }, jest.fn()]);

      const page = createRenderer().render(<TopicResourceDetails {...props} />);

      expect(page).toMatchSnapshot();
    });
  });

  describe('getServerSideProps', () => {
    let req;
    let topicSlug;
    let resourceSlug;
    let params;

    beforeEach(() => {
      req = {};
      topicSlug = 'topic-slug';
      resourceSlug = 'resource-slug';
      params = {
        topicSlug,
        resourceSlug,
      };
    });

    afterEach(() => {
      getTopicResourceBySlug.mockReset();
    });

    it('should return props when topic resource found', async () => {
      const topicId = '123';
      const resourceId = '456';
      const topicResource = {
        topic: {
          id: topicId,
        },
        resource: {
          id: resourceId,
        },
      };
      const expectedProps = {
        topicId,
        resourceId,
        topicSlug,
        resourceSlug,
        topicResource,
      };
      when(getTopicResourceBySlug)
        .calledWith(topicSlug, resourceSlug)
        .mockReturnValue(topicResource);

      const { props } = await getServerSideProps({ req, params });

      expect(props).toEqual(expectedProps);
    });

    it('should return not found when topic resource not found', async () => {
      when(getTopicResourceBySlug)
        .calledWith(topicSlug, resourceSlug)
        .mockImplementation(() => {
          throw new Error();
        });

      const { notFound } = await getServerSideProps({ req, params });

      expect(notFound).toBeTruthy();
    });
  });
});
