import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RatingStar from './RatingStar';

describe('<RatingStar />', () => {
  test('it should mount', () => {
    render(<RatingStar />);
    
    const ratingStar = screen.getByTestId('RatingStar');

    expect(ratingStar).toBeInTheDocument();
  });
});