import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import CallToAction from './CallToAction';

describe('<CallToAction />', () => {
  test('it should mount', () => {
    render(<CallToAction />);

    const callToAction = screen.getByTestId('CallToAction');

    expect(callToAction).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer.create(<CallToAction />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
