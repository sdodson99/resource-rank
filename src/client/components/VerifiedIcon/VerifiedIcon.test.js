import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import VerifiedIcon from './VerifiedIcon';

describe('<VerifiedIcon />', () => {
  it('should mount', () => {
    render(<VerifiedIcon />);

    const verifiedIcon = screen.getByTestId('VerifiedIcon');

    expect(verifiedIcon).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<VerifiedIcon />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with custom size', () => {
    const component = createRenderer().render(<VerifiedIcon size={100} />);

    expect(component).toMatchSnapshot();
  });
});
