import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import InfoAlert from './InfoAlert';

describe('<InfoAlert />', () => {
  it('should mount', () => {
    render(<InfoAlert />);

    const infoAlert = screen.getByTestId('InfoAlert');

    expect(infoAlert).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<InfoAlert />);

    expect(component).toMatchSnapshot();
  });
});
