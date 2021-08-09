import React, { useEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import RatingForm from './RatingForm';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

describe('<RatingForm />', () => {
  let mockSetSelectedRating;

  beforeEach(() => {
    mockSetSelectedRating = jest.fn();
    useState.mockReturnValue([null, mockSetSelectedRating]);
  });

  afterEach(() => {
    useEffect.mockReset();
    useState.mockReset();
  });

  it('should mount', () => {
    render(<RatingForm />);

    const ratingForm = screen.getByTestId('RatingForm');

    expect(ratingForm).toBeInTheDocument();
  });

  it('should update selected rating on existing rating change', () => {
    const existingRating = 5;
    render(<RatingForm existingRating={existingRating} />);

    useEffect.mock.calls[0][0]();

    expect(mockSetSelectedRating).toBeCalledWith(existingRating);
  });

  it('should submit selected rating on submit', () => {
    const mockOnSubmit = jest.fn();
    const selectedRating = 5;
    useState.mockReturnValue([selectedRating, mockSetSelectedRating]);
    render(<RatingForm onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByText('Submit');

    submitButton.click();

    expect(mockOnSubmit).toBeCalledWith(selectedRating);
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
