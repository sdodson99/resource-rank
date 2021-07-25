import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Footer from './Footer';
import renderer from 'react-test-renderer';

describe('<Footer />', () => {
  it('should mount', () => {
    render(<Footer />);

    const footer = screen.getByTestId('Footer');

    expect(footer).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer.create(<Footer />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
