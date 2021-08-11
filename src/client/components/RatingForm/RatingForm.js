import React, { useEffect, useState } from 'react';
import SelectableRatingStarGroup from '../RatingStars/SelectableRatingStarGroup/SelectableRatingStarGroup';
import PropTypes from 'prop-types';
import styles from './RatingForm.module.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const RatingForm = ({ onSubmit, isSubmitting, error, existingRating }) => {
  const [selectedRating, setSelectedRating] = useState();

  const submitRating = () => onSubmit && onSubmit(selectedRating);

  useEffect(() => {
    setSelectedRating(existingRating);
  }, [existingRating]);

  const ratingChanged = selectedRating !== existingRating;
  const validRating = selectedRating > 0;
  const canSubmitRating = ratingChanged && validRating;

  return (
    <div className={styles.RatingForm} data-testid="RatingForm">
      <SelectableRatingStarGroup
        rating={selectedRating}
        onRatingChanged={setSelectedRating}
        starSize={40}
      />

      <div className="mt-6 flex items-center">
        <button
          className="btn btn-primary"
          onClick={submitRating}
          type="button"
          disabled={!canSubmitRating}
        >
          Submit
        </button>

        {isSubmitting && (
          <div className="ml-4">
            <LoadingSpinner size={25} />
          </div>
        )}
      </div>

      {error && <div className="mt-4 error-text">Failed to submit rating.</div>}
    </div>
  );
};

RatingForm.propTypes = {
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  error: PropTypes.object,
  existingRating: PropTypes.number,
};

RatingForm.defaultProps = {
  isSubmitting: false,
  error: null,
  existingRating: 0,
};

export default RatingForm;
