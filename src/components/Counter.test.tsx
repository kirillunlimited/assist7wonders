import React from 'react';
import Counter, { Props } from './Counter';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const defaultProps: Props = {
  value: 0,
  counter: 'test',
  onChange: jest.fn(),
};

describe('render', () => {
  it('should render correctly', () => {
    render(<Counter {...defaultProps} />);
    expect(screen.getByLabelText('increment')).toBeInTheDocument();
    expect(screen.getByLabelText('decrement')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    expect(screen.queryByTitle('counter icon')).not.toBeInTheDocument();
  });
  it('should render science icon', () => {
    render(<Counter {...defaultProps} counter="compass" />);
    expect(screen.queryByAltText('compass')).toBeInTheDocument();
  });
});

describe('input value change', () => {
  it('should update on change', () => {
    let value = 0;
    const onChange = jest.fn(x => {
      value = x;
    });
    const { rerender } = render(<Counter {...defaultProps} value={value} onChange={onChange} />);

    const input = screen.getByDisplayValue('0');
    fireEvent.change(input!, { target: { value: 1 } });
    fireEvent.blur(input!);
    expect(value).toBe(1);

    rerender(<Counter {...defaultProps} value={value} onChange={onChange} />);

    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });
  it('should convert empty string to zero', () => {
    let value = 1;
    const onChange = jest.fn(x => {
      value = x;
    });
    const { rerender } = render(<Counter {...defaultProps} value={value} onChange={onChange} />);

    const input = screen.getByDisplayValue('1');
    fireEvent.change(input!, { target: { value: '' } });
    fireEvent.blur(input!);
    expect(value).toBe(0);

    rerender(<Counter {...defaultProps} value={value} onChange={onChange} />);

    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });
  it('should round value', () => {
    let value = 0;
    const onChange = jest.fn(x => {
      value = x;
    });

    const { rerender } = render(<Counter {...defaultProps} value={value} onChange={onChange} />);

    const input = screen.getByDisplayValue('0');
    fireEvent.change(input!, { target: { value: 1.9 } });
    fireEvent.blur(input!);
    expect(value).toBe(2);

    rerender(<Counter {...defaultProps} value={value} onChange={onChange} />);
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });
  it('should not update on change if new value is bigger than max', () => {
    let value = 10;
    const max = 10;
    const onChange = jest.fn(x => {
      value = x;
    });

    const { rerender } = render(
      <Counter {...defaultProps} value={value} max={max} onChange={onChange} />
    );

    const input = screen.getByDisplayValue('10');
    fireEvent.change(input!, { target: { value: 20 } });
    fireEvent.blur(input!);
    expect(value).toBe(10);

    rerender(<Counter {...defaultProps} value={value} onChange={onChange} />);
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });
  it('should not update on change if new value is less than min', () => {
    let value = 0;
    const min = 0;
    const onChange = jest.fn(x => {
      value = x;
    });
    const { rerender } = render(
      <Counter {...defaultProps} value={value} min={min} onChange={onChange} />
    );
    const input = screen.getByDisplayValue('0');
    fireEvent.change(input!, { target: { value: -10 } });
    fireEvent.blur(input!);
    expect(value).toBe(0);

    rerender(<Counter {...defaultProps} value={value} onChange={onChange} />);
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });
});

describe('increment & decrement', () => {
  it('should update on decrement', async () => {
    let value = 0;
    const onChange = jest.fn(x => {
      value = x;
    });
    const { rerender } = render(<Counter {...defaultProps} value={value} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('increment'));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    rerender(<Counter {...defaultProps} value={value} onChange={onChange} />);
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });
  it('should update on increment', async () => {
    let value = 0;
    const onChange = jest.fn(x => {
      value = x;
    });
    const { rerender } = render(<Counter {...defaultProps} value={value} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('decrement'));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(-1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    rerender(<Counter {...defaultProps} value={value} onChange={onChange} />);
    expect(screen.getByDisplayValue('-1')).toBeInTheDocument();
  });
  it('should not increment if increment button is disabled', async () => {
    let value = 10;
    const max = 10;
    const onChange = jest.fn(x => {
      value = x;
    });
    render(<Counter {...defaultProps} value={value} max={max} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('increment'));
    await waitFor(() => expect(onChange).not.toHaveBeenCalled());
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });
  it('should not decrement if decrement button is disabled', async () => {
    let value = 0;
    const min = 0;
    const onChange = jest.fn(x => {
      value = x;
    });
    render(<Counter {...defaultProps} value={value} min={min} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('decrement'));
    await waitFor(() => expect(onChange).not.toHaveBeenCalled());
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });
});
