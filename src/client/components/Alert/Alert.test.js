import React, { useRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Alert from './Alert';
import { createRenderer } from 'react-test-renderer/shallow';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(),
}));

describe('<Alert />', () => {
  afterEach(() => {
    useRef.mockReset();
  });

  it('should mount', () => {
    render(<Alert />);

    const alert = screen.getByTestId('Alert');

    expect(alert).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const page = createRenderer().render(<Alert>Message</Alert>);

    expect(page).toMatchSnapshot();
  });

  it('should render correctly when border is true', () => {
    const page = createRenderer().render(<Alert border={true}>Message</Alert>);

    expect(page).toMatchSnapshot();
  });

  it('should render correctly when className provided', () => {
    const page = createRenderer().render(
      <Alert className={'border-red-700'}>Message</Alert>
    );

    expect(page).toMatchSnapshot();
  });

  it('should render correctly when icon provided', () => {
    const page = createRenderer().render(
      <Alert icon={<div>Icon</div>}>Message</Alert>
    );

    expect(page).toMatchSnapshot();
  });

  it('should scroll into view when scrollTo is true', async () => {
    const mockScrollIntoView = jest.fn();
    const mockRef = { current: {} };
    Object.defineProperty(mockRef, 'current', {
      get() {
        return this._current;
      },
      set(_current) {
        if (_current) {
          _current.scrollIntoView = mockScrollIntoView;
        }

        this._current = _current;
      },
    });
    useRef.mockReturnValue(mockRef);

    await act(async () => render(<Alert scrollTo={true} />));

    expect(mockScrollIntoView).toBeCalled();
  });
});
