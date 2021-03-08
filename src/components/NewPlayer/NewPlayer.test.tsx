import React from 'react';
import NewPlayer from './NewPlayer';
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
  names: ['John', 'Bill'],
  wonders: ['foo', 'bar', 'baz'],
  selectedWonders: ['foo', 'bar'],
  isMax: false,
  onSubmit: jest.fn(),
};

function open() {
  fireEvent.click(screen.getByLabelText('add'));
  return within(document.body).getByRole('dialog');
}

describe('render', () => {
  it('should render add button', () => {
    render(<NewPlayer {...defaultProps} />);
    expect(screen.getByLabelText('add')).toBeInTheDocument();
  });
  it('should render modal on add button click', () => {
    render(<NewPlayer {...defaultProps} />);
    const dialog = open();
    expect(dialog).toBeInTheDocument();
  });
  it('should render form on add button click', () => {
    render(<NewPlayer {...defaultProps} />);
    open();
    expect(screen.getByLabelText('New Player')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('select')).toBeInTheDocument();
    expect(screen.getByRole('submit')).toBeInTheDocument();
    expect(screen.getByLabelText('close')).toBeInTheDocument();
  });
  it('should render preselected wonder', () => {
    render(<NewPlayer {...defaultProps} />);
    open();
    const currentWonder = screen.getByRole('select')!.querySelector('input')!.value;
    expect(defaultProps.wonders).toContain(currentWonder);
    expect(defaultProps.selectedWonders).not.toContain(currentWonder);
  });
  it('should render error message if player is already exists', () => {
    render(<NewPlayer {...defaultProps} />);
    open();
    const input = screen.getByLabelText('New Player').querySelector('input');
    fireEvent.change(input!, { target: { value: 'John' } });
    expect(screen.getByLabelText('Error message')).toBeInTheDocument();
  });
  it('should close dialog on close button click', async () => {
    render(<NewPlayer {...defaultProps} />);
    const dialog = open();
    fireEvent.click(screen.getByLabelText('close'));
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });
  it('should close dialog on backdrop click', async () => {
    render(<NewPlayer {...defaultProps} />);
    const dialog = open();
    const backdrop = document.querySelector('.MuiDialog-container');
    fireEvent.mouseDown(backdrop!);
    fireEvent.mouseUp(backdrop!);
    fireEvent.click(backdrop!);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });
});

describe('add new player', () => {
  it('should add new player and clear input', async () => {
    let names: string[] = [...defaultProps.names];
    let selectedWonders = [defaultProps.selectedWonders[0]];
    const onSubmit = jest.fn(name => {
      names = [...names, name];
    });
    const { rerender } = render(<NewPlayer {...defaultProps} names={names} onSubmit={onSubmit} />);
    open();
    const wonder = screen.getByRole('select')!.querySelector('input')!.value;
    const input = screen.getByLabelText('New Player').querySelector('input');
    fireEvent.change(input!, { target: { value: 'Max' } });
    fireEvent.click(screen.getByRole('submit'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(names).toEqual([...defaultProps.names, 'Max']);
    selectedWonders = [...selectedWonders, wonder];

    rerender(
      <NewPlayer
        {...defaultProps}
        names={names}
        selectedWonders={selectedWonders}
        onSubmit={onSubmit}
      />
    );
    expect(input!.value).toEqual('');
    const shuffledWonder = screen.getByRole('select')!.querySelector('input')!.value;
    expect(wonder).not.toEqual(shuffledWonder);
  });
  it('should not add new player if input is empty', async () => {
    let names: string[] = [...defaultProps.names];
    const onSubmit = jest.fn(name => {
      names = [...names, name];
    });
    render(<NewPlayer {...defaultProps} names={names} onSubmit={onSubmit} />);
    open();
    const input = screen.getByLabelText('New Player').querySelector('input');
    fireEvent.click(screen.getByRole('submit'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(0));
    expect(names).toEqual(['John', 'Bill']);
    expect(input!.value).toEqual('');
  });
  it('should not add new player if player is already exists', async () => {
    let names: string[] = [...defaultProps.names];
    const onSubmit = jest.fn(name => {
      names = [...names, name];
    });
    render(<NewPlayer {...defaultProps} names={names} onSubmit={onSubmit} />);
    open();
    const input = screen.getByLabelText('New Player').querySelector('input');
    fireEvent.change(input!, { target: { value: 'John' } });
    fireEvent.click(screen.getByRole('submit'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(0));
    expect(names).toEqual(['John', 'Bill']);
    expect(input!.value).toEqual('John');
  });
  it('should not add new player if there are no wonders left', async () => {
    let names: string[] = [...defaultProps.names];
    const selectedWonders = [...defaultProps.wonders];
    const onSubmit = jest.fn(name => {
      names = [...names, name];
    });
    render(
      <NewPlayer
        {...defaultProps}
        names={names}
        selectedWonders={selectedWonders}
        onSubmit={onSubmit}
      />
    );
    open();
    const input = screen.getByLabelText('New Player').querySelector('input');
    fireEvent.change(input!, { target: { value: 'Max' } });
    fireEvent.click(screen.getByRole('submit'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(0));
    expect(names).toEqual(['John', 'Bill']);
    expect(input!.value).toEqual('Max');
  });
});
