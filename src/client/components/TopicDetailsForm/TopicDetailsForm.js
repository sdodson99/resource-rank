import Link from 'next/link';
import React from 'react';
import ErrorAlert from '../Alerts/ErrorAlert/ErrorAlert';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import TextInput from '../TextInput/TextInput';
import PropTypes from 'prop-types';
import styles from './TopicDetailsForm.module.css';
import { useFormContext } from 'react-hook-form';
import hasAlphaNumericCharacter from '@/validators/alpha-numeric';
import isProfane from '@/validators/profanity';

const TopicDetailsForm = ({
  onSubmit,
  onInvalid,
  cancelHref,
  errorMessage,
  nameFieldName,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const nameFieldOptions = {
    required: 'Required',
    maxLength: {
      value: 50,
      message: 'Must be less than 50 characters',
    },
    validate: {
      hasAlphaNumericCharacter: (name) =>
        hasAlphaNumericCharacter(name) ||
        'Must contain an alpha-numeric character',
      isNotProfane: (name) => !isProfane(name) || 'Must not contain profanity',
    },
  };
  const nameFieldErrorMessage = errors[nameFieldName]?.message;

  return (
    <div className={styles.TopicDetailsForm} data-testid="TopicDetailsForm">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        {errorMessage && (
          <div className="mb-10">
            <ErrorAlert border={true} scrollTo={!!errorMessage}>
              {errorMessage}
            </ErrorAlert>
          </div>
        )}

        <div>
          <TextInput
            name={nameFieldName}
            label="Name"
            errorMessage={nameFieldErrorMessage}
            autoComplete="off"
            {...register(nameFieldName, nameFieldOptions)}
          />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row">
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </button>

          <Link href={cancelHref}>
            <a className="mt-3 text-center btn btn-cancel-outline w-100 sm:mt-0 sm:ml-3">
              Cancel
            </a>
          </Link>

          {isSubmitting && (
            <div className="mt-5 sm:mt-0 sm:ml-3 self-center">
              <LoadingSpinner size={30} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

TopicDetailsForm.propTypes = {
  onSubmit: PropTypes.func,
  onInvalid: PropTypes.func,
  cancelHref: PropTypes.string,
  errorMessage: PropTypes.string,
  nameFieldName: PropTypes.string,
};

TopicDetailsForm.defaultProps = {};

export default TopicDetailsForm;
