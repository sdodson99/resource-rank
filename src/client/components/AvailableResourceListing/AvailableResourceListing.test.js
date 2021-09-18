import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AvailableResourceListing from './AvailableResourceListing';
import renderer from 'react-test-renderer';

describe('<AvailableResourceListing />', () => {
  let props;

  beforeEach(() => {
    props = {
      selectedPage: 3,
      pageCount: 5,
    };
  });

  it('should mount', () => {
    render(<AvailableResourceListing {...props} />);

    const availableResourceListing = screen.getByTestId(
      'AvailableResourceListing'
    );

    expect(availableResourceListing).toBeInTheDocument();
  });

  describe('with multiple resources', () => {
    beforeEach(() => {
      props.resources = [
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
    });

    it('should render correctly', () => {
      const tree = renderer
        .create(<AvailableResourceListing {...props} />)
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('without resources', () => {
    it('should render correctly', () => {
      const tree = renderer
        .create(<AvailableResourceListing {...props} />)
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
