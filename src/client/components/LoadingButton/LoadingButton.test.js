import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoadingButton from './LoadingButton';
import renderer from 'react-test-renderer';

describe('<LoadingButton />', () => {
  it('should mount', () => {
    render(<LoadingButton />);

    const loadingButton = screen.getByTestId('LoadingButton');

    expect(loadingButton).toBeInTheDocument();
  });

  it('should render correctly when loading', () => {
    const tree = renderer
      .create(<LoadingButton isLoading={true}>Content</LoadingButton>)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when not loading', () => {
    const tree = renderer
      .create(<LoadingButton isLoading={false}>Content</LoadingButton>)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when disabled', () => {
    const tree = renderer
      .create(
        <LoadingButton isLoading={false} disabled={true}>
          Content
        </LoadingButton>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
