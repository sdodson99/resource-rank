import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import InfoAlert from './InfoAlert';
import { useIntersectionObserver } from 'react-intersection-observer-hook';

jest.mock('react-intersection-observer-hook');
useIntersectionObserver.mockReturnValue([createRef(), {}]);

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
