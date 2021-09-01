import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PageGap from './PageGap';

describe('<PageGap />', () => {
  it('should mount', () => {
    render(<PageGap />);

    const pageGap = screen.getByTestId('PageGap');

    expect(pageGap).toBeInTheDocument();
  });
});
