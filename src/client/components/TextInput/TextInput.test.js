import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextInput from './TextInput';
import renderer from 'react-test-renderer';

describe('<TextInput />', () => {
  it('should mount', () => {
    render(<TextInput name={'input'} />);

    const textInput = screen.getByTestId('TextInput');

    expect(textInput).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer.create(<TextInput name={'input'} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render correct when label provided', () => {
    const tree = renderer
      .create(<TextInput name={'input'} label={'Data Input'} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when error message provided', () => {
    const tree = renderer
      .create(<TextInput name={'input'} errorMessage={'Error message.'} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
