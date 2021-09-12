import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import ResourceDetailsForm from './ResourceDetailsForm';
import { useFormContext } from 'react-hook-form';
import hasAlphaNumericCharacter from '@/validators/alpha-numeric';
import isProfane from '@/validators/profanity';
import { isURL } from 'validator';

jest.mock('react-hook-form');
jest.mock('@/validators/alpha-numeric');
jest.mock('@/validators/profanity');
jest.mock('validator');

describe('<ResourceDetailsForm />', () => {
  let props;
  let formContext;

  beforeEach(() => {
    props = {
      onSubmit: jest.fn(),
      onInvalid: jest.fn(),
      cancelHref: '/back',
      errorMessage: '',
      nameFieldName: 'NAME',
      linkFieldName: 'LINK',
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
    isURL.mockReset();
  });

  it('should mount', () => {
    render(<ResourceDetailsForm {...props} />);

    const component = screen.getByTestId('ResourceDetailsForm');

    expect(component).toBeInTheDocument();
  });

  describe('name field', () => {
    let actualNameFieldName;
    let actualNameFieldOptions;

    beforeEach(() => {
      render(<ResourceDetailsForm {...props} />);

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

  describe('link field', () => {
    let actualLinkFieldName;
    let actualLinkFieldOptions;

    beforeEach(() => {
      render(<ResourceDetailsForm {...props} />);

      actualLinkFieldName = formContext.register.mock.calls[1][0];
      actualLinkFieldOptions = formContext.register.mock.calls[1][1];
    });

    it('should register', () => {
      expect(actualLinkFieldName).toBe(props.linkFieldName);
    });

    it('should register with required validation', () => {
      expect(actualLinkFieldOptions.required).toBeDefined();
    });

    it('should register with URL validation', () => {
      isURL.mockReturnValue(false);

      const message = actualLinkFieldOptions.validate.isURL('value');

      expect(message).toBeDefined();
    });
  });

  it('should render correctly', () => {
    const component = createRenderer().render(
      <ResourceDetailsForm {...props} />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with error message', () => {
    props.errorMessage = 'Error message.';

    const component = createRenderer().render(
      <ResourceDetailsForm {...props} />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render correctly when submitting', () => {
    props.isSubmitting = true;

    const component = createRenderer().render(
      <ResourceDetailsForm {...props} />
    );

    expect(component).toMatchSnapshot();
  });
});
