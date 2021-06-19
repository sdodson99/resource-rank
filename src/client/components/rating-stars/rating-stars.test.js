import React from 'react';
import { render } from '@testing-library/react';
import RatingStars from './rating-stars';

describe('Rating Stars', () => {
  describe('With 0 rating', () => {
    let getAllByLabelTextQuery;

    beforeEach(() => {
      const { getAllByLabelText } = render(<RatingStars rating={0} />);

      getAllByLabelTextQuery = getAllByLabelText;
    });

    it('Displays 0 full stars.', () => {
      const getFullStars = () => getAllByLabelTextQuery('star-full');

      expect(getFullStars).toThrowError();
    });

    it('Displays 0 half stars.', () => {
      const getHalfStars = () => getAllByLabelTextQuery('star-half');

      expect(getHalfStars).toThrowError();
    });

    it('Displays 5 empty stars.', () => {
      const getEmptyStars = () => getAllByLabelTextQuery('star-empty');

      expect(getEmptyStars().length).toBe(5);
    });
  });

  describe('With 2.5 rating', () => {
    let getAllByLabelTextQuery;

    beforeEach(() => {
      const { getAllByLabelText } = render(<RatingStars rating={2.5} />);

      getAllByLabelTextQuery = getAllByLabelText;
    });

    it('Displays 2 full stars.', () => {
      const getFullStars = () => getAllByLabelTextQuery('star-full');

      expect(getFullStars().length).toBe(2);
    });

    it('Displays 1 half star.', () => {
      const getHalfStars = () => getAllByLabelTextQuery('star-half');

      expect(getHalfStars().length).toBe(1);
    });

    it('Displays 2 empty stars.', () => {
      const getEmptyStars = () => getAllByLabelTextQuery('star-empty');

      expect(getEmptyStars().length).toBe(2);
    });
  });

  describe('With 5 rating', () => {
    let getAllByLabelTextQuery;

    beforeEach(() => {
      const { getAllByLabelText } = render(<RatingStars rating={5} />);

      getAllByLabelTextQuery = getAllByLabelText;
    });

    it('Displays 5 full stars.', () => {
      const getFullStars = () => getAllByLabelTextQuery('star-full');

      expect(getFullStars().length).toBe(5);
    });

    it('Displays 0 half stars.', () => {
      const getHalfStars = () => getAllByLabelTextQuery('star-half');

      expect(getHalfStars).toThrowError();
    });

    it('Displays 0 empty stars.', () => {
      const getEmptyStars = () => getAllByLabelTextQuery('star-empty');

      expect(getEmptyStars).toThrowError();
    });
  });
});
