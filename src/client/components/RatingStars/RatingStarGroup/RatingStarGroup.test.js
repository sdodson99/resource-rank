import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RatingStarGroup from './RatingStarGroup';

describe('<RatingStarGroup />', () => {
  test('it should mount', () => {
    render(<RatingStarGroup />);
    
    const ratingStarGroup = screen.getByTestId('RatingStarGroup');

    expect(ratingStarGroup).toBeInTheDocument();
  });
});