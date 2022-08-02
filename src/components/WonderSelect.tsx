import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

export type Props = {
  value: string;
  wonders: string[];
  selectedWonders: string[];
  variant?: 'filled' | 'standard' | 'outlined' | undefined;
  onSelect: (wonder: string) => void;
};

export default function WonderSelect(props: Props) {
  const { t } = useTranslation();

  function isValueSelected(wonder: string) {
    return props.selectedWonders.includes(wonder);
  }

  function onChange(event: SelectChangeEvent<string>) {
    const value = event.target.value as string;
    if (!isValueSelected(value)) {
      props.onSelect(value);
    }
  }

  return (
    <FormControl
      variant={props.variant}
      sx={{
        width: 1,
      }}
    >
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
