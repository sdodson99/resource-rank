import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import TopicDetailsForm from './TopicDetailsForm';
import { useFormContext } from 'react-hook-form';
import hasAlphaNumericCharacter from '@/validators/alpha-numeric';
import isProfane from '@/validators/profanity';

jest.mock('react-hook-form');
jest.mock('@/validators/alpha-numeric');
jest.mock('@/validators/profanity');

describe('<TopicDetailsForm />', () => {
  let props;
  let formContext;

  beforeEach(() => {
    props = {
      onSubmit: jest.fn(),
      onInvalid: jest.fn(),
      cancelHref: '/back',
      errorMessage: '',
      nameFieldName: 'NAME',
    };

    formContext = {
      handleSubmit: jest.fn(),
      register: jest.fn(),
      formState: {
        errors: {},
      },
    };
    useFormContext.mockReturnValue(formContext);
  });

  afterEach(() => {
    useFormContext.mockReset();
    hasAlphaNumericCharacter.mockReset();
    isProfane.mockReset();
  });

  it('should mount', () => {
    render(<TopicDetailsForm {...props} />);

    const topicDetailsForm = screen.getByTestId('TopicDetailsForm');

    expect(topicDetailsForm).toBeInTheDocument();
  });

  describe('name field', () => {
    let actualNameFieldName;
    let actualNameFieldOptions;

    beforeEach(() => {
      render(<TopicDetailsForm {...props} />);

      actualNameFieldName = formContext.register.mock.calls[0][0];
      actualNameFieldOptions = formContext.register.mock.calls[0][1];
    });

    it('should register', () => {
      expect(actualNameFieldName).toBe(props.nameFieldName);
    });

    it('should register with required validation', () => {
      expect(actualNameFieldOptions.required).toBeDefined();
    });

    it('should register with max length validation', () => {
      expect(actualNameFieldOptions.maxLength.value).toBe(50);
    });

    it('should register with alpha-numeric validation', () => {
      hasAlphaNumericCharacter.mockReturnValue(false);

      const message =
        actualNameFieldOptions.validate.hasAlphaNumericCharacter('value');

      expect(message).toBeDefined();
    });

    it('should register with profanity validation', () => {
      isProfane.mockReturnValue(true);

      const message = actualNameFieldOptions.validate.isNotProfane('value');

      expect(message).toBeDefined();
    });
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<TopicDetailsForm {...props} />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with error message', () => {
    props.errorMessage = 'Error message.';

    const component = createRenderer().render(<TopicDetailsForm {...props} />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly when submitting', () => {
    props.isSubmitting = true;

    const component = createRenderer().render(<TopicDetailsForm {...props} />);

    expect(component).toMatchSnapshot();
  });
});
