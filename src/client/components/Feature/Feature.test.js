import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import Feature from './Feature';

describe('<Feature />', () => {
  test('it should mount', () => {
    render(<Feature />);

    const feature = screen.getByTestId('Feature');

    expect(feature).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer.create(<Feature description="123" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
