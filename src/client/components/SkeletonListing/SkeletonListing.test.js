import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import SkeletonListing from './SkeletonListing';

describe('<SkeletonListing />', () => {
  it('should mount', () => {
    render(<SkeletonListing />);

    const skeletonListing = screen.getByTestId('SkeletonListing');

    expect(skeletonListing).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<SkeletonListing />);

    expect(component).toMatchSnapshot();
  });
});
