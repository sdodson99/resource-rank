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
      <ActiveLink
        href={'/'}
        className="className"
        linkClassName="linkClassName"
      >
        Link
      </ActiveLink>
    );

    expect(page).toMatchSnapshot();
  });

  describe('with active', () => {
    const path = '/home';

    beforeEach(() => {
      useRouter.mockReturnValue({ asPath: path });
    });

    it('should render correctly', () => {
      const page = createRenderer().render(
        <ActiveLink href={path}>Link</ActiveLink>
      );

      expect(page).toMatchSnapshot();
    });

    it('should have active class name', () => {
      render(<ActiveLink href={path}>Link</ActiveLink>);

      const activeLink = screen.getByTestId('ActiveLink');

      expect(activeLink.classList).toContain('active');
    });
  });

  describe('with not active', () => {
    beforeEach(() => {
      useRouter.mockReturnValue({ asPath: '/home' });
    });

    it('should render correctly', () => {
      const page = createRenderer().render(
        <ActiveLink href="/">Link</ActiveLink>
      );

      expect(page).toMatchSnapshot();
    });

    it('should have active class name', () => {
      render(<ActiveLink href="/">Link</ActiveLink>);

      const activeLink = screen.getByTestId('ActiveLink');

      expect(activeLink.classList).not.toContain('active');
    });
  });
});
