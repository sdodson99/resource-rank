import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Listing from './Listing';

describe('<Listing />', () => {
  it('should mount', () => {
    render(<Listing />);

    const listing = screen.getByTestId('Listing');

    expect(listing).toBeInTheDocument();
  });
});
