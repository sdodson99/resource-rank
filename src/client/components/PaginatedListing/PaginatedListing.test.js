import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import PaginatedListing from './PaginatedListing';
import { when } from 'jest-when';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

describe('<PaginatedListing />', () => {
  let props;

  beforeEach(() => {
    props = {
      children: [<div key="1">Child 1</div>],
      pageCount: 3,
      selectedPage: 2,
    };
  });

  afterEach(() => {
    useEffect.mockReset();
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

  it('should scroll to top when selected page or page count changes', () => {
    window.scrollTo = jest.fn();
    when(useEffect)
      .calledWith(expect.any(Function), [props.selectedPage, props.pageCount])
      .mockImplementation((cb) => cb());

    render(<PaginatedListing {...props} />);

    expect(window.scrollTo).toBeCalledWith({ top: 0, behavior: 'smooth' });
  });
});
