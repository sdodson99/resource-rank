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
      .create(
        <TopicResourceListingItem
          topicId={'123'}
          topicSlug={'topic-name'}
          resourceSlug={'resource-name'}
          rating={3}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when verified', () => {
    const tree = renderer
      .create(
        <TopicResourceListingItem
          topicId={'123'}
          topicSlug={'topic-name'}
          resourceSlug={'resource-name'}
          rating={3}
          verified={true}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
