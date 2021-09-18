import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ListingItem from './ListingItem';
import { createRenderer } from 'react-test-renderer/shallow';

describe('<ListingItem />', () => {
  it('should mount', () => {
    render(<ListingItem />);

    const listingItem = screen.getByTestId('ListingItem');

    expect(listingItem).toBeInTheDocument();
  });

  describe('with hover enabled', () => {
    it('should render correctly', () => {
      const tree = createRenderer().render(
        <ListingItem hover={true}>Hello world.</ListingItem>
      );

      expect(tree).toMatchSnapshot();
    });
  });

  describe('with hover disabled', () => {
    it('should render correctly', () => {
      const tree = createRenderer().render(
        <ListingItem hover={false}>Hello world.</ListingItem>
      );

      expect(tree).toMatchSnapshot();
    });
  });

  it('should render correctly with xPadding disabled', () => {
    const tree = createRenderer().render(
      <ListingItem xPadding={false}>Hello world.</ListingItem>
    );

    expect(tree).toMatchSnapshot();
  });
});
