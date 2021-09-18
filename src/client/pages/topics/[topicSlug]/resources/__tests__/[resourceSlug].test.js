import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import getTopicResourceBySlug from '@/services/topic-resources/graphql-topic-resource-by-slug-service';
import { when } from 'jest-when';
import TopicResourceDetails, {
  getServerSideProps,
} from '../[resourceSlug].page';
import useRatingSubmitter from '@/hooks/ratings/use-rating-submitter';
import useRating from '@/hooks/ratings/use-rating';
import withApp from '@/test-utils/with-app';

jest.mock('@/services/topic-resources/graphql-topic-resource-by-slug-service');
jest.mock('@/hooks/ratings/use-rating-submitter');
jest.mock('@/hooks/ratings/use-rating');

describe('<TopicResourceDetails />', () => {
  describe('page', () => {
    let mockSubmitRating;
    let mockIsSubmittingRating;

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

      useRating.mockReturnValue({
        rating: null,
        isLoading: false,
        error: null,
      });

      topicId = '123';
      resourceId = '456';
      topicSlug = 'topic-slug';
      resourceSlug = 'resource-slug';
      topicResource = {
        resource: {},
        ratingList: {
          sum: 5,
          count: 1,
        },
      };
      props = {
        topicId,
        resourceId,
        topicSlug,
        resourceSlug,
        topicResource,
      };
    });

    afterEach(() => {
      useRating.mockReset();
      useRatingSubmitter.mockReset();
    });

    it('should mount', () => {
      render(withApp(TopicResourceDetails, props));

      const page = screen.getByTestId('TopicResourceDetailsPage');

      expect(page).toBeInTheDocument();
    });

    describe('new resource alert', () => {
      it('should display new resource alert when isNew is true', () => {
        props.isNew = true;
        render(withApp(TopicResourceDetails, props));

        const alert = screen.getByTestId('InfoAlert');

        expect(alert).toBeInTheDocument();
      });

      it('should not display new resource alert when isNew is not true', () => {
        props.isNew = false;
        render(withApp(TopicResourceDetails, props));

        const alert = screen.queryByTestId('InfoAlert');

        expect(alert).toBeNull();
      });
    });

    it('should show existing rating on rating load', () => {
      const rating = {
        id: 789,
        value: 5,
      };
      useRating.mockReturnValue({
        rating,
        isLoading: false,
        error: null,
      });

      render(withApp(TopicResourceDetails, props));

      const ratingForm = screen.getByTestId('RatingForm');
      const fullRatingStars = ratingForm.querySelectorAll(
        '[data-testid="FullRatingStar"]'
      );
      expect(fullRatingStars.length).toBe(5);
    });

    describe('on submit rating', () => {
      function renderAndSubmit() {
        render(withApp(TopicResourceDetails, props));

        const ratingForm = screen.getByTestId('RatingForm');
        const selectableRatingStar = ratingForm.querySelectorAll(
          '[data-testid="RatingStarGroup_RatingStar"]'
        )[2];
        selectableRatingStar.click();

        const submitButton = screen.getByText('Submit');
        submitButton.click();
      }

      function getResourceRating() {
        const ratingStarGroupHeader =
          screen.getAllByTestId('RatingStarGroup')[0];
        const fullRatingStars = ratingStarGroupHeader.querySelectorAll(
          '[data-testid="FullRatingStar"]'
        );

        return fullRatingStars.length;
      }

      describe('if successful', () => {
        let submittedRating;

        beforeEach(() => {
          submittedRating = {
            value: 3,
          };
          mockSubmitRating.mockReturnValue(submittedRating);
        });

        it('should correclty update resource rating when no existing rating', async () => {
          renderAndSubmit();

          await waitFor(() => {
            expect(getResourceRating()).toBe(4);
          });
        });

        it('should correclty update resource rating when existing rating', async () => {
          useRating.mockReturnValue({
            rating: {
              value: 5,
            },
            isLoading: false,
            error: null,
          });

          renderAndSubmit();

          await waitFor(() => {
            expect(getResourceRating()).toBe(3);
          });
        });
      });

      it('should set submit rating error if unsuccessful', async () => {
        mockSubmitRating.mockImplementation(() => {
          throw new Error();
        });

        renderAndSubmit();

        await waitFor(() => {
          const errorMessage = screen.getByText('Failed to submit rating.');
          expect(errorMessage).toBeInTheDocument();
        });
      });
    });

    it('should render correctly', () => {
      const page = renderer
        .create(withApp(TopicResourceDetails, props))
        .toJSON();

      expect(page).toMatchSnapshot();
    });

    it('should render correctly when verified', () => {
      props.topicResource.resource.verified = true;

      const page = renderer
        .create(withApp(TopicResourceDetails, props))
        .toJSON();

      expect(page).toMatchSnapshot();
    });

    it('should render correctly when not logged in', () => {
      const page = renderer
        .create(
          withApp(TopicResourceDetails, props, { mock: 'unauthenticated' })
        )
        .toJSON();

      expect(page).toMatchSnapshot();
    });
  });

  describe('getServerSideProps', () => {
    let req;
    let params;
    let query;
    let topicSlug;
    let resourceSlug;
    let topicId;
    let resourceId;
    let topicResource;
    let mock;

    beforeEach(() => {
      mock = 'mock';
      query = {
        mock,
      };
      req = {};
      topicSlug = 'topic-slug';
      resourceSlug = 'resource-slug';
      params = {
        topicSlug,
        resourceSlug,
      };
      topicId = '123';
      resourceId = '456';
      topicResource = {
        topic: {
          id: topicId,
        },
        resource: {
          id: resourceId,
        },
      };
    });

    afterEach(() => {
      getTopicResourceBySlug.mockReset();
    });

    it('should return props when topic resource found', async () => {
      const expectedProps = {
        topicId,
        resourceId,
        topicSlug,
        resourceSlug,
        topicResource,
        isNew: false,
      };
      when(getTopicResourceBySlug)
        .calledWith(topicSlug, resourceSlug, { mock })
        .mockReturnValue(topicResource);

      const { props } = await getServerSideProps({ req, params, query });

      expect(props).toEqual(expectedProps);
    });

    it('should return not found when topic resource not found', async () => {
      when(getTopicResourceBySlug)
        .calledWith(topicSlug, resourceSlug, { mock })
        .mockImplementation(() => {
          throw new Error();
        });

      const { notFound } = await getServerSideProps({ req, params, query });

      expect(notFound).toBeTruthy();
    });

    it('should return isNew if resource is new', async () => {
      when(getTopicResourceBySlug)
        .calledWith(topicSlug, resourceSlug, { mock })
        .mockReturnValue(topicResource);
      query.new = 'true';

      const {
        props: { isNew },
      } = await getServerSideProps({ req, params, query });

      expect(isNew).toBeTruthy();
    });
  });
});
