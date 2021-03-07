import * as React from 'react';
import { useEffect, useState } from 'react';
import { IconButton, Input } from '@material-ui/core';
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import styles from './Counter.module.css';
import { SCORE_ICONS } from '../../utils/game';
import { isMinValue, isMaxValue } from '../../utils/score';

export type Props = {
  counter: string;
  value: number;
  handleChange: (value: number) => void;
  max?: number;
  min?: number;
};

export default function Counter(props: Props) {
  const [localValue, setLocalValue] = useState(String(props.value));

  useEffect(() => {
    setLocalValue(String(props.value));
  }, [props.value]);

  function handleDecrement(): void {
    const value = isMinValue(props.value - 1, props.min) ? Number(props.min) : props.value - 1;
    props.handleChange(value);
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
    props.handleChange(intValue);
  }

  return (
    <div className={styles.container}>
      {SCORE_ICONS[props.counter] ? (
        <img
          data-testid="science"
          src={SCORE_ICONS[props.counter]}
          className={styles.scoreIcon}
          alt={props.counter}
        />
      ) : null}
      <div>
        <IconButton
          data-testid="decrement"
          onClick={handleDecrement}
          disabled={isMinValue(Number(localValue), props.min)}
        >
          <RemoveCircle
            color={isMinValue(Number(localValue), props.min) ? 'disabled' : 'primary'}
            fontSize="large"
          />
        </IconButton>
        <Input
          data-testid="input"
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
        <IconButton
          data-testid="increment"
          id="plus"
          onClick={handleIncrement}
          disabled={isMaxValue(Number(localValue), props.max)}
        >
          <AddCircle
            color={isMaxValue(Number(localValue), props.max) ? 'disabled' : 'primary'}
            fontSize="large"
          />
        </IconButton>
      </div>
    </div>
  );
}
