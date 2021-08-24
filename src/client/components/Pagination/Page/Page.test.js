import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import Page from './Page';

describe('<Page />', () => {
  it('should mount', () => {
    render(<Page />);

    const page = screen.getByTestId('Page');

    expect(page).toBeInTheDocument();
  });

  it('should execute on click with page number when clicked', () => {
    const mockOnClick = jest.fn();
    render(<Page number={5} onClick={mockOnClick} />);
    const page = screen.getByTestId('Page');
    
    page.click();

    expect(mockOnClick).toBeCalledWith(5);
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<Page number={3} />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly when selected', () => {
    const component = createRenderer().render(<Page isSelected={true} />);

    expect(component).toMatchSnapshot();
  });
});
