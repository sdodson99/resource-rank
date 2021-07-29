import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TopicListingItem from './TopicListingItem';
import { createRenderer } from 'react-test-renderer/shallow';

describe('<TopicListingItem />', () => {
  test('it should mount', () => {
    render(<TopicListingItem />);

    const topicListingItem = screen.getByTestId('TopicListingItem');

    expect(topicListingItem).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = createRenderer().render(
      <TopicListingItem name="Topic1" slug="topic1" />
    );

    expect(tree).toMatchSnapshot();
  });
});
