import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BreadcrumbLayout from './BreadcrumbLayout';
import { createRenderer } from 'react-test-renderer/shallow';
import withApp from '@/test-utils/with-app';

describe('<BreadcrumbLayout />', () => {
  it('should mount', () => {
    render(withApp(BreadcrumbLayout));

    const breadcrumbLayout = screen.getByTestId('BreadcrumbLayout');

    expect(breadcrumbLayout).toBeInTheDocument();
  });

  describe('with multiple breadcrumbs', () => {
    const breadcrumbs = [
      {
        to: '/',
        title: 'Home',
      },
      {
        to: '/topics',
        title: 'topics',
      },
    ];

    it('should render correctly', () => {
      const page = createRenderer().render(
        <BreadcrumbLayout breadcrumbs={breadcrumbs} />
      );

      expect(page).toMatchSnapshot();
    });
  });

  describe('without breadcrumbs', () => {
    it('should render correctly', () => {
      const page = createRenderer().render(<BreadcrumbLayout />);

      expect(page).toMatchSnapshot();
    });
  });
});
