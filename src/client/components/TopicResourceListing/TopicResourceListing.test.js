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
        id: '123',
        resource: {
          id: '123',
        },
      },
      {
        id: '456',
        resource: {
          id: '123',
        },
      },
      {
        id: '789',
        resource: {
          id: '123',
        },
      },
    ];

    it('should render correctly', () => {
      const tree = renderer
        .create(
          <TopicResourceListing topicId={'123'} topics={topicResources} />
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('without topic resources', () => {
    it('should render correctly', () => {
      const tree = renderer
        .create(<TopicResourceListing topicId={'123'} />)
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
