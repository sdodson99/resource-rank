/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import NewTopic from '../new.page';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useTopicCreator from '@/hooks/topics/use-topic-creator';
import TopicExistsError from '@/errors/topic-exists-error';
import { when } from 'jest-when';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
jest.mock('next/router');
jest.mock('@/hooks/topics/use-topic-creator');
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));
jest.mock(
  '@/components/TopicDetailsForm/TopicDetailsForm',
  () =>
    ({ onSubmit, onInvalid }) =>
      (
        <div>
          <button
            onClick={() => onSubmit({ name: 'name' })}
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

describe('<NewTopic />', () => {
  let mockCreateTopic;
  let mockSetError;
  let mockPush;
  let mockSetCreateTopicError;

  beforeEach(() => {
    mockSetError = jest.fn();
    useForm.mockReturnValue({
      setError: mockSetError,
    });

    mockSetCreateTopicError = jest.fn();
    useState.mockReturnValue([null, mockSetCreateTopicError]);

    mockCreateTopic = jest.fn();
    useTopicCreator.mockReturnValue({
      createTopic: mockCreateTopic,
    });

    mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    useState.mockReset();
    useRouter.mockReset();
    useTopicCreator.mockReset();
  });

  it('should mount', () => {
    render(<NewTopic />);

    const topicDetailsForm = screen.getByTestId('NewTopic');

    expect(topicDetailsForm).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<NewTopic />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with create topic error', () => {
    useState.mockReturnValue([new Error(), mockSetCreateTopicError]);

    const component = createRenderer().render(<NewTopic />);

    expect(component).toMatchSnapshot();
  });

  describe('on valid submit', () => {
    function renderAndSubmit() {
      render(<NewTopic />);
      const submitButton = screen.getByTestId('SubmitButton');
      submitButton.click();
    }

    it('should navigate with created topic slug if successful', async () => {
      when(mockCreateTopic)
        .calledWith({ name: 'name' })
        .mockReturnValue({ slug: 'name-slug' });

      renderAndSubmit();

      await waitFor(() => {
        expect(mockPush).toBeCalledWith('/topics/name-slug');
      });
    });

    it('should set topic name exists error if topics exists error thrown', async () => {
      when(mockCreateTopic)
        .calledWith({ name: 'name' })
        .mockImplementation(() => {
          throw new TopicExistsError();
        });

      renderAndSubmit();

      await waitFor(() => {
        expect(mockSetError).toBeCalledWith('name', {
          message: 'Name already exists.',
        });
      });
    });

    it('should set general create topic error if general error thrown', async () => {
      when(mockCreateTopic)
        .calledWith({ name: 'name' })
        .mockImplementation(() => {
          throw new Error();
        });

      renderAndSubmit();

      await waitFor(() => {
        expect(mockSetCreateTopicError).toBeCalled();
      });
    });
  });

  it('should clear generic error on invalid submit', () => {
    render(<NewTopic />);
    const invalidButton = screen.getByTestId('InvalidButton');

    invalidButton.click();

    expect(mockSetCreateTopicError).toBeCalledWith(null);
  });
});
