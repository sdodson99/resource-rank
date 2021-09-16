import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActiveLink from './ActiveLink';
import { createRenderer } from 'react-test-renderer/shallow';
import { useRouter } from 'next/router';

jest.mock('next/router');

describe('<ActiveLink />', () => {
  let props;

  beforeEach(() => {
    props = {
      url: {
        pathname: '/',
      },
      className: 'className',
      linkClassName: 'linkClassName',
    };
  });

  afterEach(() => {
    useRouter.mockReset();
  });

  it('should mount', () => {
    render(<ActiveLink {...props}>Link</ActiveLink>);

    const activeLink = screen.getByTestId('ActiveLink');

    expect(activeLink).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const page = createRenderer().render(
      <ActiveLink {...props}>Link</ActiveLink>
    );

    expect(page).toMatchSnapshot();
  });

  describe('with active', () => {
    let path;

    beforeEach(() => {
      path = '/home';

      props.url.pathname = path;
      useRouter.mockReturnValue({ asPath: path });
    });

    it('should render correctly', () => {
      const page = createRenderer().render(
        <ActiveLink {...props}>Link</ActiveLink>
      );

      expect(page).toMatchSnapshot();
    });

    it('should have active class name', () => {
      render(<ActiveLink {...props}>Link</ActiveLink>);

      const activeLink = screen.getByTestId('ActiveLink');

      expect(activeLink.classList).toContain('active');
    });
  });

  describe('with active and query parameters', () => {
    let path;

    beforeEach(() => {
      path = '/home';
      props.url.pathname = path;

      useRouter.mockReturnValue({ asPath: '/home?test=123' });
    });

    it('should render correctly', () => {
      const page = createRenderer().render(
        <ActiveLink {...props}>Link</ActiveLink>
      );

      expect(page).toMatchSnapshot();
    });

    it('should have active class name', () => {
      render(<ActiveLink {...props}>Link</ActiveLink>);

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
        <ActiveLink {...props}>Link</ActiveLink>
      );

      expect(page).toMatchSnapshot();
    });

    it('should have active class name', () => {
      render(<ActiveLink {...props}>Link</ActiveLink>);

      const activeLink = screen.getByTestId('ActiveLink');

      expect(activeLink.classList).not.toContain('active');
    });
  });
});
