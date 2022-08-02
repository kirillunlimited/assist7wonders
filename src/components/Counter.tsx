import React, { useEffect, useState } from 'react';
import { Box, IconButton, Input } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { SCORE_ICONS } from '../utils/score';
import { isMinValue, isMaxValue } from '../utils/score';

export type Props = {
  counter: string;
  value: number;
  onChange: (value: number) => void;
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
    const intValue = Math.round(Number(value));
    setLocalValue(String(intValue));
    props.onChange(intValue);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {SCORE_ICONS[props.counter] ? (
        <Box
          component="img"
          src={SCORE_ICONS[props.counter]}
          sx={{ width: '3em' }}
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
          sx={{ width: '2em' }}
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
    </Box>
  );
}
