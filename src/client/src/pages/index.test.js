import 'regenerator-runtime';
import React from 'react';
import renderer from 'react-test-renderer';
import Index from './index';

jest.mock('../hooks/use-read-only-mode-status');

describe('home page', () => {
  it('should render correctly', () => {
    const page = renderer.create(<Index />).toJSON();

    expect(page).toMatchSnapshot();
  });
});
