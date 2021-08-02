import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RatingStarGroup from './RatingStarGroup';
import { createRenderer } from 'react-test-renderer/shallow';

describe('<RatingStarGroup />', () => {
  test('it should mount', () => {
    render(<RatingStarGroup />);

    const ratingStarGroup = screen.getByTestId('RatingStarGroup');

    expect(ratingStarGroup).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(
      <RatingStarGroup starSize={50} maxRating={5} />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with empty rating', () => {
    const component = createRenderer().render(<RatingStarGroup rating={0} />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with half rating', () => {
    const component = createRenderer().render(<RatingStarGroup rating={2.5} />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with full rating', () => {
    const component = createRenderer().render(<RatingStarGroup rating={5} />);

    expect(component).toMatchSnapshot();
  });

  it('should execute onStarClick callback for star index when star clicked', () => {
    const mockOnStarClick = jest.fn();
    const clickedStarIndex = 2;
    render(<RatingStarGroup onStarClick={mockOnStarClick} />);
    const ratingStar = screen.getAllByTestId('RatingStarGroup_RatingStar')[
      clickedStarIndex
    ];

    ratingStar.click();

    expect(mockOnStarClick).toBeCalledWith(clickedStarIndex);
  });
});
