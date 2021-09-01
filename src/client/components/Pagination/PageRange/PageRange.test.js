import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import PageRange from './PageRange';

describe('<PageRange />', () => {
  it('should mount', () => {
    render(<PageRange />);

    const pageRange = screen.getAllByTestId('Page');

    expect(pageRange.length).toBe(2);
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<PageRange />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with many pages', () => {
    const component = createRenderer().render(<PageRange last={20} />);

    expect(component).toMatchSnapshot();
  });
});
