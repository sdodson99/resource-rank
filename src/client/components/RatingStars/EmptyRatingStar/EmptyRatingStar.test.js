import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmptyRatingStar from './EmptyRatingStar';
import { createRenderer } from 'react-test-renderer/shallow';

describe('<EmptyRatingStar />', () => {
  it('should mount', () => {
    render(<EmptyRatingStar />);

    const emptyRatingStar = screen.getByTestId('EmptyRatingStar');

    expect(emptyRatingStar).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<EmptyRatingStar />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with custom size', () => {
    const component = createRenderer().render(<EmptyRatingStar size={100} />);

    expect(component).toMatchSnapshot();
  });
});
