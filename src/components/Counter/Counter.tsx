import * as React from 'react';
import { SCORE_ICONS } from '../../utils/game';
import styles from './Counter.module.css';
import { IconButton, Input } from '@material-ui/core';
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { useEffect, useState } from 'react';

interface IProps {
  counter: string;
  value: number;
  title: string;
  handleChange: (value: number) => void;
  max?: number;
  min?: number;
}

export default function Counter(props: IProps) {
  const [localValue, setLocalValue] = useState(String(props.value));

  useEffect(() => {
    setLocalValue(String(props.value));
  }, [props.value]);

  function isMinValue(value: number, min?: number): boolean {
    return min !== undefined && value <= min;
  }
  function handleDecrement(): void {
    const value = isMinValue(props.value - 1, props.min) ? Number(props.min) : props.value - 1;
    props.handleChange(value);
  }

  function isMaxValue(value: number, max?: number): boolean {
    return max !== undefined && value >= max;
  }
  function handleIncrement(): void {
    const value = isMaxValue(props.value + 1, props.max) ? Number(props.max) : props.value + 1;
    props.handleChange(value);
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setLocalValue(event.target.value);
  }

  function onBlur(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const value = isMaxValue(Number(event.target.value), props.max)
      ? props.max
      : isMinValue(Number(event.target.value), props.min)
      ? props.min
      : event.target.value;
    const intValue = Math.floor(Number(value));
    setLocalValue(String(intValue) || '0'); // empty string should be set to '0'
    props.handleChange(intValue);
  }

  return (
    <div className={styles.container}>
      {SCORE_ICONS[props.counter] ? (
        <img src={SCORE_ICONS[props.counter]} className={styles.scoreIcon} alt={props.counter} />
      ) : null}
      <div>
        <IconButton onClick={handleDecrement} disabled={isMinValue(Number(localValue), props.min)}>
          <RemoveCircle
            color={isMinValue(Number(localValue), props.min) ? 'disabled' : 'primary'}
            fontSize="large"
          />
        </IconButton>
        <Input
          style={{ width: 48 }}
          type="number"
          onChange={onChange}
          onBlur={onBlur}
          value={localValue}
          inputProps={{
            max: props.max,
            min: props.min,
          }}
        />
        <IconButton onClick={handleIncrement} disabled={isMaxValue(Number(localValue), props.max)}>
          <AddCircle
            color={isMaxValue(Number(localValue), props.max) ? 'disabled' : 'primary'}
            fontSize="large"
          />
        </IconButton>
      </div>
    </div>
  );
}
