import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmptyRatingStar from './EmptyRatingStar';

describe('<EmptyRatingStar />', () => {
  test('it should mount', () => {
    render(<EmptyRatingStar />);
    
    const emptyRatingStar = screen.getByTestId('EmptyRatingStar');

    expect(emptyRatingStar).toBeInTheDocument();
  });
});