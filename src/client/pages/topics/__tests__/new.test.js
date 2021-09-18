import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import NewTopic, { Page } from '../new.page';
import useTopicCreator from '@/hooks/topics/use-topic-creator';
import TopicExistsError from '@/errors/topic-exists-error';
import { when } from 'jest-when';
import useNavigate from '@/hooks/use-navigate';
import withApp from '@/test-utils/with-app';
import renderer from 'react-test-renderer';

jest.mock('@/hooks/use-navigate');
jest.mock('@/hooks/topics/use-topic-creator');

describe('<NewTopic />', () => {
  describe('page', () => {
    let mockCreateTopic;
    let mockNavigate;

    beforeEach(() => {
      mockCreateTopic = jest.fn();
      useTopicCreator.mockReturnValue({
        createTopic: mockCreateTopic,
      });

      mockNavigate = jest.fn();
      useNavigate.mockReturnValue(mockNavigate);
    });

    afterEach(() => {
      useNavigate.mockReset();
      useTopicCreator.mockReset();
    });

    it('should mount', () => {
      render(withApp(Page));

      const page = screen.getByTestId('NewTopic');

      expect(page).toBeInTheDocument();
    });

    describe('on submit', () => {
      function submitForm() {
        const submitButton = screen.getByText('Submit');
        submitButton.click();
      }

      function renderAndSubmit() {
        render(withApp(Page));

        userEvent.type(screen.getByLabelText('Name'), 'name');

        submitForm();
      }

      it('should navigate with created topic slug if successful', async () => {
        when(mockCreateTopic)
          .calledWith({ name: 'name' })
          .mockReturnValue({ slug: 'name-slug' });

        renderAndSubmit();

        await waitFor(() => {
          expect(mockNavigate).toBeCalledWith({
            pathname: `/topics/name-slug`,
            query: {
              new: true,
            },
          });
        });
      });

      it('should show topic name exists error if topics exists error thrown', async () => {
        when(mockCreateTopic)
          .calledWith({ name: 'name' })
          .mockImplementation(() => {
            throw new TopicExistsError();
          });

        renderAndSubmit();

        await waitFor(() => {
          const errorMessage = screen.getByText('Name already exists.');
          expect(errorMessage).toBeInTheDocument();
        });
      });

      it('should show general create topic error if general error thrown', async () => {
        when(mockCreateTopic)
          .calledWith({ name: 'name' })
          .mockImplementation(() => {
            throw new Error();
          });

        renderAndSubmit();

        await waitFor(() => {
          const errorMessage = screen.getByText('Failed to create topic.');
          expect(errorMessage).toBeInTheDocument();
        });
      });

      it('should clear generic error on invalid submit', async () => {
        mockCreateTopic.mockImplementation(() => {
          throw new Error();
        });
        renderAndSubmit();
        await waitFor(() => {
          const errorMessage = screen.getByText('Failed to create topic.');
          expect(errorMessage).toBeInTheDocument();
        });

        userEvent.clear(screen.getByLabelText('Name'));
        submitForm();

        await waitFor(() => {
          const errorMessage = screen.queryByText('Failed to create topic.');
          expect(errorMessage).toBeNull();
        });
      });
    });

    it('should render correctly', () => {
      const page = renderer.create(withApp(Page)).toJSON();

      expect(page).toMatchSnapshot();
    });
  });

  describe('HOC page', () => {
    it('should require authentication', () => {
      const page = renderer
        .create(withApp(NewTopic, {}, { mock: 'unauthenticated' }))
        .toJSON();

      expect(page).toMatchSnapshot();
    });
  });
});
