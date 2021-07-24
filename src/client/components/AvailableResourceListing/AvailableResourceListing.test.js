import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AvailableResourceListing from './AvailableResourceListing';
import renderer from 'react-test-renderer';

describe('<AvailableResourceListing />', () => {
  test('it should mount', () => {
    render(<AvailableResourceListing />);

    const availableResourceListing = screen.getByTestId(
      'AvailableResourceListing'
    );

    expect(availableResourceListing).toBeInTheDocument();
  });

  describe('with multiple resources', () => {
    const resources = [
      {
        id: '123',
        name: 'Resource1',
        alreadyAdded: true,
      },
      {
        id: '456',
        name: 'Resource2',
        alreadyAdded: false,
      },
      {
        id: '789',
        name: 'Resource3',
        alreadyAdded: true,
      },
    ];

    it('should render correctly', () => {
      const tree = renderer
        .create(<AvailableResourceListing resources={resources} />)
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('without resources', () => {
    it('should render correctly', () => {
      const tree = renderer.create(<AvailableResourceListing />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
