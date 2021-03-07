import React from 'react';
import Counter from './Counter';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

const defaultProps = {
  value: 0,
  counter: 'test',
  handleChange: jest.fn(),
};

describe('render', () => {
  it('should render correctly', () => {
    render(<Counter {...defaultProps} />);
    expect(screen.queryByTestId('increment')).toBeTruthy();
    expect(screen.queryByTestId('decrement')).toBeTruthy();
    expect(screen.queryByTestId('input')).toBeTruthy();
    expect(screen.queryByTestId('science')).toBeFalsy();
  });
  it('should render science icon', () => {
    render(<Counter {...defaultProps} counter="compass" />);
    expect(screen.queryByTestId('science')).toBeTruthy();
  });
});

describe('input value change', () => {
  it('should update on change', () => {
    let value = 0;
    const handleChange = jest.fn(x => {
      value = x;
    });
    render(<Counter {...defaultProps} value={value} handleChange={handleChange} />);

    const input = screen.queryByTestId('input')!.querySelector('input');
    fireEvent.change(input!, { target: { value: 1 } });
    fireEvent.blur(input!);
    expect(value).toBe(1);
  });
  it('should convert empty string to zero', () => {
    let value = 1;
    const handleChange = jest.fn(x => {
      value = x;
    });
    const { rerender } = render(
      <Counter {...defaultProps} value={value} handleChange={handleChange} />
    );

    const input = screen.queryByTestId('input')!.querySelector('input');
    fireEvent.change(input!, { target: { value: '' } });
    fireEvent.blur(input!);
    expect(value).toBe(0);

    rerender(<Counter {...defaultProps} value={value} handleChange={handleChange} />);
    expect(input!.value).toBe('0');
  });
  it('should round value', () => {
    let value = 0;
    const handleChange = jest.fn(x => {
      value = x;
    });

    const { rerender } = render(
      <Counter {...defaultProps} value={value} handleChange={handleChange} />
    );

    const input = screen.queryByTestId('input')!.querySelector('input');
    fireEvent.change(input!, { target: { value: 1.9 } });
    fireEvent.blur(input!);
    expect(value).toBe(1);

    rerender(<Counter {...defaultProps} value={value} handleChange={handleChange} />);
    expect(input!.value).toBe('1');
  });
  it('should not update on change if new value is bigger than max', () => {
    let value = 10;
    const max = 10;
    const handleChange = jest.fn(x => {
      value = x;
    });

    const { rerender } = render(
      <Counter {...defaultProps} value={value} max={max} handleChange={handleChange} />
    );

    const input = screen.queryByTestId('input')!.querySelector('input');
    fireEvent.change(input!, { target: { value: 20 } });
    fireEvent.blur(input!);
    expect(value).toBe(10);

    rerender(<Counter {...defaultProps} value={value} handleChange={handleChange} />);
    expect(input!.value).toBe('10');
  });
  it('should not update on change if new value is less than min', () => {
    let value = 0;
    const min = 0;
    const handleChange = jest.fn(x => {
      value = x;
    });
    const { rerender } = render(
      <Counter {...defaultProps} value={value} min={min} handleChange={handleChange} />
    );
    const input = screen.queryByTestId('input')!.querySelector('input');
    fireEvent.change(input!, { target: { value: -10 } });
    fireEvent.blur(input!);
    expect(value).toBe(0); // ✅

    rerender(<Counter {...defaultProps} value={value} handleChange={handleChange} />);
    expect(input!.value).toBe('0'); // ❌ Received: '0'
  });
});

describe('increment & decrement', () => {
  it('should update on decrement', async () => {
    let value = 0;
    const handleChange = jest.fn(x => {
      value = x;
    });
    const { rerender } = render(
      <Counter {...defaultProps} value={value} handleChange={handleChange} />
    );

    fireEvent.click(screen.queryByTestId('increment')!);
    await waitFor(() => expect(handleChange).toHaveBeenCalledTimes(1));

    rerender(<Counter {...defaultProps} value={value} handleChange={handleChange} />);

    const input = screen.queryByTestId('input')!.querySelector('input');
    expect(input!.value).toBe('1');
  });
  it('should update on increment', async () => {
    let value = 0;
    const handleChange = jest.fn(x => {
      value = x;
    });
    const { rerender } = render(
      <Counter {...defaultProps} value={value} handleChange={handleChange} />
    );
    fireEvent.click(screen.queryByTestId('decrement')!);
    await waitFor(() => expect(handleChange).toHaveBeenCalledTimes(1));

    rerender(<Counter {...defaultProps} value={value} handleChange={handleChange} />);

    const input = screen.queryByTestId('input')!.querySelector('input');
    expect(input!.value).toBe('-1');
  });
  it('should not increment if increment button is disabled', async () => {
    let value = 10;
    const max = 10;
    const handleChange = jest.fn(x => {
      value = x;
    });
    render(<Counter {...defaultProps} value={value} max={max} handleChange={handleChange} />);

    fireEvent.click(screen.queryByTestId('increment')!);
    await waitFor(() => expect(handleChange).not.toHaveBeenCalled());
  });
  it('should not decrement if decrement button is disabled', async () => {
    let value = 0;
    const min = 0;
    const handleChange = jest.fn(x => {
      value = x;
    });
    render(<Counter {...defaultProps} value={value} min={min} handleChange={handleChange} />);

    fireEvent.click(screen.queryByTestId('decrement')!);
    await waitFor(() => expect(handleChange).not.toHaveBeenCalled());
  });
});
