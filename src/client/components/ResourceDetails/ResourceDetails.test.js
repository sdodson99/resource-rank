import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import ResourceDetails from './ResourceDetails';

describe('<ResourceDetails />', () => {
  it('should mount', () => {
    render(<ResourceDetails />);

    const resourceDetails = screen.getByTestId('ResourceDetails');

    expect(resourceDetails).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<ResourceDetails />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with link', () => {
    const component = createRenderer().render(
      <ResourceDetails link="http://test.com" />
    );

    expect(component).toMatchSnapshot();
  });
});
