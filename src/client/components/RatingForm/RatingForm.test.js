import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import RatingForm from './RatingForm';

describe('<RatingForm />', () => {
  it('should mount', () => {
    render(<RatingForm />);

    const ratingForm = screen.getByTestId('RatingForm');

    expect(ratingForm).toBeInTheDocument();
  });

  it('should submit selected rating on submit', () => {
    const mockOnSubmit = jest.fn();
    render(<RatingForm onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByText('Submit');
    const ratingStar = screen.getAllByTestId('RatingStarGroup_RatingStar')[2];

    ratingStar.click();
    submitButton.click();

    expect(mockOnSubmit).toBeCalledWith(3);
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<RatingForm />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly when submitting', () => {
    const component = createRenderer().render(
      <RatingForm isSubmitting={true} />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with error', () => {
    const component = createRenderer().render(
      <RatingForm error={new Error()} />
    );

    expect(component).toMatchSnapshot();
  });
});
