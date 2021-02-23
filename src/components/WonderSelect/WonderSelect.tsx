import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { WONDERS } from '../../config/wonders';

interface IProps {
  value: string;
  selectedWonders: string[];
  variant?: 'filled' | 'standard' | 'outlined' | undefined;
  onSelect: (wonder: string) => void;
}

const useStyles = makeStyles(() => ({
  formControl: {
    width: '100%',
  },
}));

export default function WonderSelect(props: IProps) {
  const classes = useStyles();

  function isValueSelected(wonder: string) {
    return props.selectedWonders.includes(wonder);
  }

  function onChange(event: React.ChangeEvent<{ value: unknown }>) {
    props.onSelect(event.target.value as string);
  }

  return (
    <FormControl variant={props.variant} className={classes.formControl}>
      <InputLabel>Wonder</InputLabel>
      <Select label="Wonder" value={props.value} onChange={onChange}>
        {WONDERS.sort().map(wonder => (
          <MenuItem key={wonder} value={wonder} disabled={isValueSelected(wonder)}>
            {wonder}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
