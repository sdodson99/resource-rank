import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SelectableRatingStarGroup from './SelectableRatingStarGroup';
import { createRenderer } from 'react-test-renderer/shallow';

describe('<SelectableRatingStarGroup />', () => {
  it('should mount', () => {
    render(<SelectableRatingStarGroup />);

    const selectableRatingStarGroup = screen.getByTestId(
      'SelectableRatingStarGroup'
    );

    expect(selectableRatingStarGroup).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(
      <SelectableRatingStarGroup rating={3} maxRating={5} starSize={50} />
    );

    expect(component).toMatchSnapshot();
  });

  it('should execute onRatingChanged callback for rating when star clicked', () => {
    const mockOnStarClick = jest.fn();
    render(<SelectableRatingStarGroup onRatingChanged={mockOnStarClick} />);
    const ratingStar = screen.getAllByTestId('RatingStarGroup_RatingStar')[2];

    ratingStar.click();

    expect(mockOnStarClick).toBeCalledWith(3);
  });
});
