import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoadingErrorEmptyDataLayout from './LoadingErrorEmptyDataLayout';
import renderer from 'react-test-renderer';

describe('<LoadingErrorEmptyDataLayout />', () => {
  it('should mount', () => {
    render(<LoadingErrorEmptyDataLayout />);

    const loadingErrorEmptyDataLayout = screen.getByTestId(
      'LoadingErrorEmptyDataLayout'
    );

    expect(loadingErrorEmptyDataLayout).toBeInTheDocument();
  });

  it('should render correctly when loading', () => {
    const tree = renderer
      .create(
        <LoadingErrorEmptyDataLayout
          isLoading={true}
          loadingDisplay={<div>Loading...</div>}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when not loading and has error', () => {
    const tree = renderer
      .create(
        <LoadingErrorEmptyDataLayout
          isLoading={false}
          hasError={true}
          errorDisplay={<div>Error</div>}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when not loading, has no error, and has no data', () => {
    const tree = renderer
      .create(
        <LoadingErrorEmptyDataLayout
          isLoading={false}
          hasError={false}
          hasData={false}
          noDataDisplay={<div>No data</div>}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when not loading, has no error, and has data', () => {
    const tree = renderer
      .create(
        <LoadingErrorEmptyDataLayout
          isLoading={false}
          hasError={false}
          hasData={true}
          dataDisplay={<div>Data</div>}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
