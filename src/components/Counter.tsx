import React, { useEffect, useState } from 'react';
import { IconButton, Input } from '@material-ui/core';
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { SCORE_ICONS } from '../utils/game';
import { isMinValue, isMaxValue } from '../utils/score';

export type Props = {
  counter: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flexEnd',
  },
  scoreIcon: {
    width: '36px',
  },
});

export default function Counter(props: Props) {
  const [localValue, setLocalValue] = useState(String(props.value));
  const classes = useStyles();

  useEffect(() => {
    setLocalValue(String(props.value));
  }, [props.value]);

  function handleDecrement(): void {
    const value = isMinValue(props.value - 1, props.min) ? Number(props.min) : props.value - 1;
    props.onChange(value);
  }

  function handleIncrement(): void {
    const value = isMaxValue(props.value + 1, props.max) ? Number(props.max) : props.value + 1;
    props.onChange(value);
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
    setLocalValue(String(intValue));
    props.onChange(intValue);
  }

  return (
    <div className={classes.container}>
      {SCORE_ICONS[props.counter] ? (
        <img
          src={SCORE_ICONS[props.counter]}
          className={classes.scoreIcon}
          title="counter icon"
          alt={props.counter}
        />
      ) : null}
      <div>
        <IconButton
          aria-label="decrement"
          onClick={handleDecrement}
          disabled={isMinValue(Number(localValue), props.min)}
        >
          <RemoveCircle
            color={isMinValue(Number(localValue), props.min) ? 'disabled' : 'primary'}
            fontSize="large"
          />
        </IconButton>
        <Input
          style={{ width: 48 }}
          type="number"
          value={localValue}
          onChange={onChange}
          onBlur={onBlur}
        />
        <IconButton
          aria-label="increment"
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
