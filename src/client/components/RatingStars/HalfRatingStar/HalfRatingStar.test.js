import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HalfRatingStar from './HalfRatingStar';

describe('<HalfRatingStar />', () => {
  test('it should mount', () => {
    render(<HalfRatingStar />);
    
    const halfRatingStar = screen.getByTestId('HalfRatingStar');

    expect(halfRatingStar).toBeInTheDocument();
  });
});