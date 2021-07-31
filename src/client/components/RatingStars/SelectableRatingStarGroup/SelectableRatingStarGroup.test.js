import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SelectableRatingStarGroup from './SelectableRatingStarGroup';

describe('<SelectableRatingStarGroup />', () => {
  test('it should mount', () => {
    render(<SelectableRatingStarGroup />);
    
    const selectableRatingStarGroup = screen.getByTestId('SelectableRatingStarGroup');

    expect(selectableRatingStarGroup).toBeInTheDocument();
  });
});