import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RatingStar from './RatingStar';
import { createRenderer } from 'react-test-renderer/shallow';

describe('<RatingStar />', () => {
  it('should mount', () => {
    render(<RatingStar />);

    const ratingStar = screen.getByTestId('RatingStar');

    expect(ratingStar).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(
      <RatingStar fill={0.5} color={'orange'} size={50} />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render correctly for empty rating', () => {
    const component = createRenderer().render(<RatingStar fill={0} />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly for half rating', () => {
    const component = createRenderer().render(<RatingStar fill={0.5} />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly for full rating', () => {
    const component = createRenderer().render(<RatingStar fill={1} />);

    expect(component).toMatchSnapshot();
  });
});
