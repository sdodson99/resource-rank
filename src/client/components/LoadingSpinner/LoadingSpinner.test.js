import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoadingSpinner from './LoadingSpinner';
import renderer from 'react-test-renderer';

describe('<LoadingSpinner />', () => {
  test('it should mount', () => {
    render(<LoadingSpinner />);

    const loadingSpinner = screen.getByTestId('LoadingSpinner');

    expect(loadingSpinner).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer
      .create(<LoadingSpinner size={100} color={'red'} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
