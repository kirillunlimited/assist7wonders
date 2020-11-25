import * as React from 'react';
import Counter from "./Counter/Counter";
import styles from './Score.module.css';

interface IProps {
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

	return(
		<div>
			{props.title && <p className={styles.title}>{props.title}</p>}
			<Counter
				handleDecrement={handleDecrement}
				handleChange={handleChange}
				handleIncrement={handleIncrement}
				value={props.value}
				max={props.max}
				isMaxValueFilter={isMaxValue}
			/>
		</div>
	)
}