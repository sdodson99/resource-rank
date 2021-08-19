import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AvailableResourceListingItem from './AvailableResourceListingItem';
import renderer from 'react-test-renderer';

describe('<AvailableResourceListingItem />', () => {
  let resource;

  beforeEach(() => {
    resource = {
      id: '123',
    };
  });

  it('should mount', () => {
    render(<AvailableResourceListingItem />);

    const availableResourceListingItem = screen.getByTestId(
      'AvailableResourceListingItem'
    );

    expect(availableResourceListingItem).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const tree = renderer
      .create(<AvailableResourceListingItem resource={resource} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when resource verified', () => {
    resource.verified = true;

    const tree = renderer
      .create(<AvailableResourceListingItem resource={resource} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should call onAdd when added', () => {
    const onAdd = jest.fn();
    render(<AvailableResourceListingItem resource={resource} onAdd={onAdd} />);
    const addResourceButton = screen.getByTestId('AddResourceButton');

    fireEvent.click(addResourceButton);

    expect(onAdd).toBeCalledWith(resource);
  });

  it('should render correctly when resource has add error', () => {
    resource.hasAddError = true;

    const tree = renderer
      .create(<AvailableResourceListingItem resource={resource} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when resource already added', () => {
    resource.alreadyAdded = true;

    const tree = renderer
      .create(<AvailableResourceListingItem resource={resource} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
