import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import Hero from './Hero';
import { useRouter } from 'next/router';

jest.mock('next/router');

describe('<Hero />', () => {
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
    render(<Hero />);

    const hero = screen.getByTestId('Hero');

    expect(hero).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer.create(<Hero />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should navigate to topic search when search button clicked', () => {
    const search = 'topic123';
    render(<Hero />);
    const searchInput = screen.getByPlaceholderText('Search topics...');
    const searchButton = screen.getByText('Search');

    fireEvent.change(searchInput, {
      target: {
        value: search,
      },
    });
    searchButton.click();

    expect(mockRouterPush).toBeCalledWith(`/topics?q=${search}`);
  });
});
