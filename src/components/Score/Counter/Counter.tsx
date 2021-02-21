import * as React from 'react';
import { IconButton, Input } from '@material-ui/core';
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { useEffect, useState } from "react";

interface IProps {
  handleDecrement: () => void;
  handleChange: (value: number) => void;
  handleIncrement: () => void;
  value: number;
  max?: number;
  isMaxValueFilter: (value: number, max?: number) => boolean;
}

export default function Counter(props: IProps) {
  const [localValue, setLocalValue] = useState(String(props.value));

  useEffect(() => {
    setLocalValue(String(props.value));
  }, [props.value]);

  function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setLocalValue(event.target.value);
  }

  function onBlur(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const value = props.isMaxValueFilter(Number(event.target.value), props.max) ? props.max : event.target.value;
    const intValue = Math.floor(Number(value));
    setLocalValue(String(intValue) || '0'); // empty string should be set to '0'
    props.handleChange(intValue);
  }

  return (
    <div>
      <IconButton onClick={props.handleDecrement}>
        <RemoveCircle
          color="primary"
          fontSize="large"
        />
      </IconButton>
      <Input
        style={{width: 48}}
        type='number'
        onChange={onChange}
        onBlur={onBlur}
        value={localValue}
        inputProps={{
          max: props.max
        }}
      />
      <IconButton
        onClick={props.handleIncrement}
        disabled={props.isMaxValueFilter(Number(localValue), props.max)}
      >
        <AddCircle
          color={props.isMaxValueFilter(Number(localValue), props.max) ? 'disabled' : 'primary'}
          fontSize="large"
        />
      </IconButton>
    </div>
  )
}
