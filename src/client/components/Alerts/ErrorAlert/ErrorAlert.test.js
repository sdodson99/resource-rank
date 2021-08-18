import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ErrorAlert from './ErrorAlert';
import { createRenderer } from 'react-test-renderer/shallow';
import { useIntersectionObserver } from 'react-intersection-observer-hook';

jest.mock('react-intersection-observer-hook');
useIntersectionObserver.mockReturnValue([createRef(), {}]);

describe('<ErrorAlert />', () => {
  test('it should mount', () => {
    render(<ErrorAlert />);

    const errorAlert = screen.getByTestId('ErrorAlert');

    expect(errorAlert).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const page = createRenderer().render(<ErrorAlert>Message</ErrorAlert>);

    expect(page).toMatchSnapshot();
  });

  it('should render correctly when border is true', () => {
    const page = createRenderer().render(
      <ErrorAlert border={true}>Message</ErrorAlert>
    );

    expect(page).toMatchSnapshot();
  });

  it('should render correctly when scrollTo is true', () => {
    const page = createRenderer().render(
      <ErrorAlert scrollTo={true}>Message</ErrorAlert>
    );

    expect(page).toMatchSnapshot();
  });
});
