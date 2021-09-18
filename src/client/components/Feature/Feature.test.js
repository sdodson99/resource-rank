import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import Feature from './Feature';

describe('<Feature />', () => {
  let mockFeature;

  beforeEach(() => {
    mockFeature = {
      title: 'Title',
      description: 'Description',
      imageSrc: 'ImageSrc',
    };
  });

  it('should mount', () => {
    render(<Feature feature={mockFeature} />);

    const feature = screen.getByTestId('Feature');

    expect(feature).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer.create(<Feature feature={mockFeature} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
