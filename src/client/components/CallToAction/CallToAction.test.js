import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import CallToAction from './CallToAction';
import useNavigate from '@/hooks/use-navigate';

jest.mock('@/hooks/use-navigate');

describe('<CallToAction />', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();

    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    useNavigate.mockReset();
  });

  it('should mount', () => {
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

    expect(mockNavigate).toBeCalledWith({
      pathname: '/topics',
      query: {
        q: search,
      },
    });
  });
});
