import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import TemplateName from './TemplateName';

describe('<TemplateName />', () => {
  it('should mount', () => {
    render(<TemplateName />);

    const templateName = screen.getByTestId('TemplateName');

    expect(templateName).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<TemplateName />);

    expect(component).toMatchSnapshot();
  });
});
