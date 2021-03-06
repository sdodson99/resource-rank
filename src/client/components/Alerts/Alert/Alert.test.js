import React, { useState, createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Alert from './Alert';
import { createRenderer } from 'react-test-renderer/shallow';
import { useIntersectionObserver } from 'react-intersection-observer-hook';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('<Alert />', () => {
  beforeEach(() => {
    useState.mockReturnValue([null, jest.fn()]);
  });

  afterEach(() => {
    useState.mockReset();
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

  describe('scrollTo behavior', () => {
    let mockSetHasScrolled;
    let mockScrollIntoView;

    beforeEach(() => {
      mockSetHasScrolled = jest.fn();
      useState.mockReturnValue([false, mockSetHasScrolled]);

      mockScrollIntoView = jest.fn();
      useIntersectionObserver.mockReturnValue([
        createRef(),
        {
          entry: {
            isIntersecting: false,
            target: {
              scrollIntoView: mockScrollIntoView,
            },
          },
        },
      ]);
    });

    it('should clear has scrolled status when scrollTo changes', async () => {
      render(<Alert />);

      await waitFor(() => {
        expect(mockSetHasScrolled).toBeCalledWith(false);
      });
    });

    it('should not scroll into view when scrollTo is false', async () => {
      render(<Alert scrollTo={false} />);

      await waitFor(() => {
        expect(mockScrollIntoView).not.toBeCalled();
      });
    });

    it('should not scroll into view when component has already scrolled into view', async () => {
      useState.mockReturnValue([true, jest.fn()]);

      render(<Alert scrollTo={true} />);

      await waitFor(() => {
        expect(mockScrollIntoView).not.toBeCalled();
      });
    });

    it('should not scroll into view when component has not rendered yet', async () => {
      useIntersectionObserver.mockReturnValue([
        createRef(),
        {
          entry: null,
        },
      ]);

      render(<Alert scrollTo={true} />);

      await waitFor(() => {
        expect(mockScrollIntoView).not.toBeCalled();
      });
    });

    it('should not scroll into view when component is already visible', async () => {
      useIntersectionObserver.mockReturnValue([
        createRef(),
        {
          entry: {
            isIntersecting: true,
            target: {
              scrollIntoView: mockScrollIntoView,
            },
          },
        },
      ]);

      render(<Alert scrollTo={true} />);

      await waitFor(() => {
        expect(mockScrollIntoView).not.toBeCalled();
      });
    });

    it('should set has scrolled state when component already visible', async () => {
      useIntersectionObserver.mockReturnValue([
        createRef(),
        {
          entry: {
            isIntersecting: true,
            target: {
              scrollIntoView: mockScrollIntoView,
            },
          },
        },
      ]);

      render(<Alert scrollTo={true} />);

      await waitFor(() => {
        expect(mockSetHasScrolled).toBeCalledWith(true);
      });
    });

    it('should scroll into view when component needs to be scrolled into view', async () => {
      render(<Alert scrollTo={true} />);

      await waitFor(() => {
        expect(mockScrollIntoView).toBeCalled();
      });
    });

    it('should set has scrolled state when component scrolled into view', async () => {
      render(<Alert scrollTo={true} />);

      await waitFor(() => {
        expect(mockSetHasScrolled).toBeCalledWith(true);
      });
    });
  });
});
