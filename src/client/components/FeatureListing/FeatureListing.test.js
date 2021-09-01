import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import FeatureListing from './FeatureListing';

describe('<FeatureListing />', () => {
  test('it should mount', () => {
    render(<FeatureListing />);

    const featureListing = screen.getByTestId('FeatureListing');

    expect(featureListing).toBeInTheDocument();
  });

  describe('with features', () => {
    let features;

    beforeEach(() => {
      features = [
        {
          title: '1',
          description: '123',
          imageSrc: 'src',
        },
        {
          title: '2',
          description: '456',
          imageSrc: 'src',
        },
      ];
    });

    it('should render correctly', () => {
      const tree = renderer
        .create(<FeatureListing features={features} />)
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('without features', () => {
    it('should render correctly', () => {
      const tree = renderer.create(<FeatureListing />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
