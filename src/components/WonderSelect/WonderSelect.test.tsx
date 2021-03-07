import React from 'react';
import WonderSelect from './WonderSelect';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // "expect(...).toHaveAttribute is not a function" fix

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
  it('should render correctly', () => {
    render(<WonderSelect {...defaultProps} />);
    expect(screen.queryByTestId('select')).toBeTruthy();
    expect(screen.queryByTestId('label')).toBeTruthy();

    fireEvent.mouseDown(screen.getByRole('button'));
    const listbox = within(screen.getByRole('listbox'));
    expect(listbox.getByText(/foo/i)).toBeTruthy();
  });
  it('should render sorted items', () => {
    render(<WonderSelect {...defaultProps} />);
    fireEvent.mouseDown(screen.getByRole('button'));
    const listbox = within(screen.getByRole('listbox'));
    const items = listbox.getAllByTestId('item').map(item => item.textContent);
    expect(items).toEqual([...defaultProps.wonders].sort());
  });
});

describe('change', () => {
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

    const input = screen.queryByTestId('select')!.querySelector('input');
    expect(input!.value).toBe('foo');
  });
});

describe('selected wonders', () => {
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
