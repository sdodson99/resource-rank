import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
