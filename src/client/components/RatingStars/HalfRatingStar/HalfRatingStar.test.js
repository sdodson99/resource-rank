import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HalfRatingStar from './HalfRatingStar';
import { createRenderer } from 'react-test-renderer/shallow';

describe('<HalfRatingStar />', () => {
  test('it should mount', () => {
    render(<HalfRatingStar />);

    const halfRatingStar = screen.getByTestId('HalfRatingStar');

    expect(halfRatingStar).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<HalfRatingStar />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with custom size', () => {
    const component = createRenderer().render(<HalfRatingStar size={100} />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with custom color', () => {
    const component = createRenderer().render(
      <HalfRatingStar color={'yellow'} />
    );

    expect(component).toMatchSnapshot();
  });
});
