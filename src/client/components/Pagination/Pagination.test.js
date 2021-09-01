import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import Pagination from './Pagination';

describe('<Pagination />', () => {
  it('should mount', () => {
    render(<Pagination />);

    const pagination = screen.getByTestId('Pagination');

    expect(pagination).toBeInTheDocument();
  });

  it('should render correctly with defaults', () => {
    const component = createRenderer().render(<Pagination />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly when no page gaps needed', () => {
    const component = createRenderer().render(
      <Pagination selectedPage={3} pageCount={5} />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render correctly when pre-selected page gap needed', () => {
    const component = createRenderer().render(
      <Pagination selectedPage={18} pageCount={20} />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render correctly when post-selected page gap needed', () => {
    const component = createRenderer().render(
      <Pagination selectedPage={3} pageCount={20} />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render correctly when page gaps needed, but min gap range overriden', () => {
    const component = createRenderer().render(
      <Pagination
        selectedPage={10}
        pageCount={20}
        selectedPageGapMinRange={10}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render correctly when gaps needed and selected page range configured', () => {
    const component = createRenderer().render(
      <Pagination selectedPage={10} selectedPageRange={1} pageCount={20} />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with selected page', () => {
    const component = createRenderer().render(
      <Pagination selectedPage={3} pageCount={5} />
    );

    expect(component).toMatchSnapshot();
  });
});
