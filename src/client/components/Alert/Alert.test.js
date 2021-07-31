import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Alert from './Alert';
import { createRenderer } from 'react-test-renderer/shallow';

describe('<Alert />', () => {
  it('should mount', () => {
    render(<Alert />);

    const alert = screen.getByTestId('Alert');

    expect(alert).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const page = createRenderer().render(<Alert>Message</Alert>);

    expect(page).toMatchSnapshot();
  });

  describe('with border', () => {
    it('should render correctly', () => {
      const page = createRenderer().render(
        <Alert border={true}>Message</Alert>
      );

      expect(page).toMatchSnapshot();
    });
  });

  describe('with className', () => {
    it('should render correctly', () => {
      const page = createRenderer().render(
        <Alert className={'border-red-700'}>Message</Alert>
      );

      expect(page).toMatchSnapshot();
    });
  });

  describe('with icon', () => {
    it('should render correctly', () => {
      const page = createRenderer().render(
        <Alert icon={<div>Icon</div>}>Message</Alert>
      );

      expect(page).toMatchSnapshot();
    });
  });
});
