import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import PaginatedListing from './PaginatedListing';

describe('<PaginatedListing />', () => {
  let props;

  beforeEach(() => {
    props = {
      children: [<div key="1">Child 1</div>],
      pageCount: 3,
      selectedPage: 2,
    };
  });

  it('should mount', () => {
    render(<PaginatedListing {...props} />);

    const paginatedListing = screen.getByTestId('PaginatedListing');

    expect(paginatedListing).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<PaginatedListing {...props} />);

    expect(component).toMatchSnapshot();
  });

  it('should scroll to top when selected page or page count changes', async () => {
    window.scrollTo = jest.fn();

    render(<PaginatedListing {...props} />);

    await waitFor(() => {
      expect(window.scrollTo).toBeCalledWith({ top: 0, behavior: 'smooth' });
    });
  });
});
