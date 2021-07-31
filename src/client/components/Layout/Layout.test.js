import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Layout from './Layout';
import useReadOnlyModeEnabledQuery from '../../hooks/queries/use-read-only-mode-enabled-query';
import renderer from 'react-test-renderer';
import { useRouter } from 'next/router';

jest.mock('../../hooks/queries/use-read-only-mode-enabled-query');
jest.mock('../../hooks/use-firebase-app-context');
jest.mock('next/router');

describe('<Layout />', () => {
  beforeEach(() => {
    useReadOnlyModeEnabledQuery.mockReturnValue(true);

    useRouter.mockReturnValue({
      route: '/',
    });
  });

  afterEach(() => {
    useReadOnlyModeEnabledQuery.mockReset();
    useRouter.mockReset();
  });

  it('should mount', () => {
    render(<Layout />);

    const layout = screen.getByTestId('Layout');

    expect(layout).toBeInTheDocument();
  });

  describe('with read only mode enabled', () => {
    beforeEach(() => {
      useReadOnlyModeEnabledQuery.mockReturnValue(true);
    });

    afterEach(() => {
      useReadOnlyModeEnabledQuery.mockReset();
    });

    it('should render correctly', () => {
      const tree = renderer.create(<Layout />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('with read only mode disabled', () => {
    beforeEach(() => {
      useReadOnlyModeEnabledQuery.mockReturnValue(false);
    });

    afterEach(() => {
      useReadOnlyModeEnabledQuery.mockReset();
    });

    it('should render correctly', () => {
      const tree = renderer.create(<Layout />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
