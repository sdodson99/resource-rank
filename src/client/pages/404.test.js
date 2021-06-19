import 'regenerator-runtime';
import React from 'react';
import renderer from 'react-test-renderer';
import __404__ from './404';

jest.mock('../hooks/use-read-only-mode-status');
jest.mock('../hooks/use-firebase-app');

describe('404 page', () => {
  it('should render correctly', () => {
    const page = renderer.create(<__404__ />).toJSON();

    expect(page).toMatchSnapshot();
  });
});
