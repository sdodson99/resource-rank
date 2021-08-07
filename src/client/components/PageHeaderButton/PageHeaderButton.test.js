import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PageHeaderButton from './PageHeaderButton';
import renderer from 'react-test-renderer';

describe('<PageHeaderButton />', () => {
  test('it should mount', () => {
    render(<PageHeaderButton />);

    const pageHeaderButton = screen.getByTestId('PageHeaderButton');

    expect(pageHeaderButton).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer
      .create(<PageHeaderButton titleClassName="text-3xl" />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('with button hidden', () => {
    it('should render correctly', () => {
      const tree = renderer
        .create(<PageHeaderButton hideButton={true} />)
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
