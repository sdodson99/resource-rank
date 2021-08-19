import React from 'react';
import Link from 'next/link';
import ErrorAlert from '../Alerts/ErrorAlert/ErrorAlert';
import TextInput from '../TextInput/TextInput';
import PropTypes from 'prop-types';
import styles from './ResourceDetailsForm.module.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import hasAlphaNumericCharacter from '@/validators/alpha-numeric';
import isProfane from '@/validators/profanity';
import { isURL } from 'validator';
import { useFormContext } from 'react-hook-form';

const ResourceDetailsForm = ({
  onSubmit,
  onInvalid,
  cancelHref,
  errorMessage,
  nameFieldName,
  linkFieldName,
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

  const linkFieldOptions = {
    required: 'Required',
    validate: {
      isURL: (link) => isURL(link) || 'Must be a valid URL',
    },
  };

  const nameError = errors[nameFieldName]?.message;
  const linkError = errors[linkFieldName]?.message;

  return (
    <div
      className={styles.ResourceDetailsForm}
      data-testid="ResourceDetailsForm"
    >
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
            errorMessage={nameError}
            autoComplete="off"
            {...register(nameFieldName, nameFieldOptions)}
          />
        </div>

        <div className="mt-6">
          <TextInput
            name={linkFieldName}
            label="Link"
            errorMessage={linkError}
            autoComplete="off"
            {...register(linkFieldName, linkFieldOptions)}
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
            <a className="mt-3 text-center btn btn-danger-outline w-100 sm:mt-0 sm:ml-3">
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

ResourceDetailsForm.propTypes = {
  onSubmit: PropTypes.func,
  onInvalid: PropTypes.func,
  cancelHref: PropTypes.string,
  errorMessage: PropTypes.string,
  nameFieldName: PropTypes.string,
  linkFieldName: PropTypes.string,
};

ResourceDetailsForm.defaultProps = {};

export default ResourceDetailsForm;
