import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TopicListing from './TopicListing';
import renderer from 'react-test-renderer';

describe('<TopicListing />', () => {
  let props;

  beforeEach(() => {
    props = {
      selectedPage: 3,
      pageCount: 5,
    };
  });

  it('should mount', () => {
    render(<TopicListing {...props} />);

    const topicListing = screen.getByTestId('TopicListing');

    expect(topicListing).toBeInTheDocument();
  });

  describe('with multiple topics', () => {
    beforeEach(() => {
      props.topics = [
        {
          id: '123',
          name: 'Topic1',
          slug: 'topic1',
        },
        {
          id: '456',
          name: 'Topic2',
          slug: 'topic2',
        },
        {
          id: '789',
          name: 'Topic3',
          slug: 'topic2',
        },
      ];
    });

    it('should render correctly', () => {
      const tree = renderer.create(<TopicListing {...props} />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('without topics', () => {
    it('should render correctly', () => {
      const tree = renderer.create(<TopicListing {...props} />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
