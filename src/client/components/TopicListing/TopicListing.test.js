import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TopicListing from './TopicListing';
import renderer from 'react-test-renderer';

describe('<TopicListing />', () => {
  test('it should mount', () => {
    render(<TopicListing />);

    const topicListing = screen.getByTestId('TopicListing');

    expect(topicListing).toBeInTheDocument();
  });

  describe('with multiple topics', () => {
    const topics = [
      {
        id: '123',
        name: 'Topic1',
      },
      {
        id: '456',
        name: 'Topic2',
      },
      {
        id: '789',
        name: 'Topic3',
      },
    ];

    it('should render correctly', () => {
      const tree = renderer.create(<TopicListing topics={topics} />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('without topics', () => {
    it('should render correctly', () => {
      const tree = renderer.create(<TopicListing />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
