import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FullRatingStar from './FullRatingStar';
import { createRenderer } from 'react-test-renderer/shallow';

describe('<FullRatingStar />', () => {
  it('should mount', () => {
    render(<FullRatingStar />);

    const fullRatingStar = screen.getByTestId('FullRatingStar');

    expect(fullRatingStar).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<FullRatingStar />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with custom size', () => {
    const component = createRenderer().render(<FullRatingStar size={100} />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with custom color', () => {
    const component = createRenderer().render(
      <FullRatingStar color={'yellow'} />
    );

    expect(component).toMatchSnapshot();
  });
});
