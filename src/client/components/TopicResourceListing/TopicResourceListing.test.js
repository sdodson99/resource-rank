import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import TopicResourceListing from './TopicResourceListing';

describe('<TopicResourceListing />', () => {
  test('it should mount', () => {
    render(<TopicResourceListing />);

    const topicResourceListing = screen.getByTestId('TopicResourceListing');

    expect(topicResourceListing).toBeInTheDocument();
  });

  describe('with multiple topic resources', () => {
    const topicResources = [
      {
        resource: {
          id: '123',
          slug: 'resource-name',
        },
        ratingList: {
          average: 1,
        },
      },
      {
        resource: {
          id: '123',
          slug: 'resource-name2',
        },
        ratingList: {
          average: 3,
        },
      },
      {
        resource: {
          id: '123',
          slug: 'resource-name3',
        },
        ratingList: {
          average: 5,
        },
      },
    ];

    it('should render correctly', () => {
      const tree = renderer
        .create(
          <TopicResourceListing
            topicId={'123'}
            topicSlug="topic-name"
            topicResources={topicResources}
          />
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('without topic resources', () => {
    it('should render correctly', () => {
      const tree = renderer
        .create(<TopicResourceListing topicId={'123'} topicSlug="topic-name" />)
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
