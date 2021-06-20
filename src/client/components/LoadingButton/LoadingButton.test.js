import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoadingButton from './LoadingButton';
import renderer from 'react-test-renderer';

describe('<LoadingButton />', () => {
  test('it should mount', () => {
    render(<LoadingButton />);

    const loadingButton = screen.getByTestId('LoadingButton');

    expect(loadingButton).toBeInTheDocument();
  });

  describe('with loading', () => {
    it('should render correctly', () => {
      const tree = renderer
        .create(<LoadingButton isLoading={true}>Content</LoadingButton>)
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('with not loading', () => {
    it('should render correctly', () => {
      const tree = renderer
        .create(<LoadingButton isLoading={false}>Content</LoadingButton>)
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
