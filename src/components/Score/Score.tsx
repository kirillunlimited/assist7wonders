import * as React from 'react';
import Counter from './Counter/Counter';
import { SCORE_ICONS } from '../../config/score';
import styles from './Score.module.css';
import { TScoreKey } from '../../types';

interface IProps {
  scoreKey: TScoreKey;
  value: number;
  title: string;
  handleChange: (value: number) => void;
  max?: number;
}

export default function Score(props: IProps) {
  function handleDecrement(): void {
    props.handleChange(props.value - 1);
  }

  function handleChange(value: number): void {
    props.handleChange(value);
  }

  function handleIncrement(): void {
    const value = isMaxValue(props.value + 1, props.max) ? Number(props.max) : props.value + 1;
    props.handleChange(value);
  }

  function isMaxValue(value: number, max?: number): boolean {
    return max !== undefined && value >= max;
  }

  return (
    <div className={styles.container}>
      {SCORE_ICONS[props.scoreKey] ? (
        <img src={SCORE_ICONS[props.scoreKey]} className={styles.scoreIcon} alt={props.scoreKey} />
      ) : null}
      <Counter
        handleDecrement={handleDecrement}
        handleChange={handleChange}
        handleIncrement={handleIncrement}
        value={props.value}
        max={props.max}
        isMaxValueFilter={isMaxValue}
      />
    </div>
  );
}
