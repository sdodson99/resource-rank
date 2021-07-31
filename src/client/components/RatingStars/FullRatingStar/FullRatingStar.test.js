import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FullRatingStar from './FullRatingStar';

describe('<FullRatingStar />', () => {
  test('it should mount', () => {
    render(<FullRatingStar />);
    
    const fullRatingStar = screen.getByTestId('FullRatingStar');

    expect(fullRatingStar).toBeInTheDocument();
  });
});