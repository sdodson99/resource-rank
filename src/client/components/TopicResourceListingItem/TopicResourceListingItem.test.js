import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import TopicResourceListingItem from './TopicResourceListingItem';

describe('<TopicResourceListingItem />', () => {
  test('it should mount', () => {
    render(<TopicResourceListingItem />);

    const topicResourceListingItem = screen.getByTestId(
      'TopicResourceListingItem'
    );

    expect(topicResourceListingItem).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer
      .create(<TopicResourceListingItem topicId={'123'} resourceId={'123'} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
