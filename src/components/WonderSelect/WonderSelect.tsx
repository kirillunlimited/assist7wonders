import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';

export interface Props {
  value: string;
  wonders: string[];
  selectedWonders: string[];
  variant?: 'filled' | 'standard' | 'outlined' | undefined;
  onSelect: (wonder: string) => void;
}

const useStyles = makeStyles(() => ({
  formControl: {
    width: '100%',
  },
}));

export default function WonderSelect(props: Props) {
  const classes = useStyles();
  const { t } = useTranslation();

  function isValueSelected(wonder: string) {
    return props.selectedWonders.includes(wonder);
  }

  function onChange(event: React.ChangeEvent<{ value: unknown }>) {
    const value = event.target.value as string;
    if (!isValueSelected(value)) {
      props.onSelect(value);
    }
  }

  return (
    <FormControl variant={props.variant} className={classes.formControl}>
      <InputLabel role="label">{t('wonder')}</InputLabel>
      <Select role="select" label={t('wonder')} value={props.value} onChange={onChange}>
        {[...props.wonders].sort().map(wonder => (
          <MenuItem key={wonder} value={wonder} disabled={isValueSelected(wonder)}>
            {wonder}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
