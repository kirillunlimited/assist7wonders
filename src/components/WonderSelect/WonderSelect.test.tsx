import React from 'react';
import WonderSelect from './WonderSelect';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // "expect(...).toHaveAttribute is not a function" fix
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

const defaultProps = {
  value: '',
  wonders: ['foo', 'bar', 'baz'],
  selectedWonders: [],
  onSelect: jest.fn(),
};

describe('render', () => {
  it('should render select', () => {
    render(<WonderSelect {...defaultProps} />);
    expect(screen.getByRole('select')).toBeInTheDocument();
    expect(screen.getByRole('label')).toBeInTheDocument();
  });
  it('should render selected with value', () => {
    const value = 'foo';
    render(<WonderSelect {...defaultProps} value={value} />);
    expect(screen.getByDisplayValue('foo')).toBeInTheDocument();
  });
  it('should render options on click', () => {
    render(<WonderSelect {...defaultProps} />);
    fireEvent.mouseDown(screen.getByRole('button'));
    const listbox = within(screen.getByRole('listbox'));
    expect(listbox.getByText(/foo/i)).toBeInTheDocument();
  });
  it('should render sorted items', () => {
    render(<WonderSelect {...defaultProps} />);
    fireEvent.mouseDown(screen.getByRole('button'));
    const listbox = within(screen.getByRole('listbox'));
    const items = listbox.getAllByRole('option').map(item => item.textContent);
    expect(items).toEqual([...defaultProps.wonders].sort());
  });
});

describe('select', () => {
  it('should update selected value on change', async () => {
    let value = '';
    const onSelect = jest.fn(x => {
      value = x;
    });
    const { rerender } = render(
      <WonderSelect {...defaultProps} value={value} onSelect={onSelect} />
    );

    fireEvent.mouseDown(screen.getByRole('button'));
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText(/foo/i));
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1));
    expect(value).toEqual('foo');

    rerender(<WonderSelect {...defaultProps} value={value} onSelect={onSelect} />);
    expect(screen.getByDisplayValue('foo')).toBeInTheDocument();
  });
  it('should not allow to select selected option', async () => {
    let value = '';
    const selectedWonders = ['foo'];
    const onSelect = jest.fn(x => {
      value = x;
    });
    render(
      <WonderSelect
        {...defaultProps}
        value={value}
        onSelect={onSelect}
        selectedWonders={selectedWonders}
      />
    );

    fireEvent.mouseDown(screen.getByRole('button'));
    const listbox = within(screen.getByRole('listbox'));
    expect(listbox.getByText(/foo/i))!.toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(listbox.getByText(/foo/i));
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(0));
    expect(value).toEqual('');
  });
});
