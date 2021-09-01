import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import CallToAction from './CallToAction';
import { useRouter } from 'next/router';

jest.mock('next/router');

describe('<CallToAction />', () => {
  let mockRouterPush;

  beforeEach(() => {
    mockRouterPush = jest.fn();

    useRouter.mockReturnValue({
      push: mockRouterPush,
    });
  });

  afterEach(() => {
    useRouter.mockReset();
  });

  test('it should mount', () => {
    render(<CallToAction />);

    const callToAction = screen.getByTestId('CallToAction');

    expect(callToAction).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer.create(<CallToAction />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should navigate to topic search when search button clicked', () => {
    const search = 'topic123';
    render(<CallToAction />);
    const searchInput = screen.getByPlaceholderText('Search...');
    const searchButton = screen.getByText('Search Topics');

    fireEvent.change(searchInput, {
      target: {
        value: search,
      },
    });
    searchButton.click();

    expect(mockRouterPush).toBeCalledWith(`/topics?q=${search}`);
  });
});
