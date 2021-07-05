import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActiveLink from './ActiveLink';
import { createRenderer } from 'react-test-renderer/shallow';
import { useRouter } from 'next/router';

jest.mock('next/router');

describe('<ActiveLink />', () => {
  afterEach(() => {
    useRouter.mockReset();
  });

  it('should mount', () => {
    render(<ActiveLink href="/">Link</ActiveLink>);

    const activeLink = screen.getByTestId('ActiveLink');

    expect(activeLink).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const page = createRenderer().render(
      <ActiveLink href="/">Link</ActiveLink>
    );

    expect(page).toMatchSnapshot();
  });

  it('should have active class name when active', () => {
    useRouter.mockReturnValue({ route: '/home' });
    render(<ActiveLink href="/home">Link</ActiveLink>);

    const activeLink = screen.getByTestId('ActiveLink');

    expect(activeLink.classList).toContain('active');
  });

  it('should not have active class name when not active', () => {
    useRouter.mockReturnValue({ route: '/home' });
    render(<ActiveLink href="/about">Link</ActiveLink>);

    const activeLink = screen.getByTestId('ActiveLink');

    expect(activeLink.classList).not.toContain('active');
  });
});
