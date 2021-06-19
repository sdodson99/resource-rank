import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Layout from './Layout';
import useReadOnlyModeStatus from '../../hooks/use-read-only-mode-status';
import renderer from 'react-test-renderer';

jest.mock('../../hooks/use-read-only-mode-status');
jest.mock('../../hooks/use-firebase-app');

describe('<Layout />', () => {
  beforeEach(() => {
    useReadOnlyModeStatus.mockReturnValue(true);
  });

  afterEach(() => {
    useReadOnlyModeStatus.mockReset();
  });

  it('should mount', () => {
    render(<Layout />);

    const layout = screen.getByTestId('Layout');

    expect(layout).toBeInTheDocument();
  });

  describe('with read only mode enabled', () => {
    beforeEach(() => {
      useReadOnlyModeStatus.mockReturnValue(true);
    });

    afterEach(() => {
      useReadOnlyModeStatus.mockReset();
    });

    it('should display read only mode', () => {
      render(<Layout />);

      const readOnlyModeElement = screen.queryByText(
        'Application is in read-only mode.'
      );

      expect(readOnlyModeElement).toBeTruthy();
    });

    it('should render correctly', () => {
      const tree = renderer.create(<Layout />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('with read only mode disabled', () => {
    beforeEach(() => {
      useReadOnlyModeStatus.mockReturnValue(false);
    });

    afterEach(() => {
      useReadOnlyModeStatus.mockReset();
    });

    it('should not display read only mode', () => {
      render(<Layout />);

      const readOnlyModeElement = screen.queryByText(
        'Application is in read-only mode.'
      );

      expect(readOnlyModeElement).toBeNull();
    });

    it('should render correctly', () => {
      const tree = renderer.create(<Layout />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
