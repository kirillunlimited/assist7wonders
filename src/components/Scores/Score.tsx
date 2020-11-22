import * as React from 'react';
import InputCounter from "./InputCounter";
import styles from './Score.module.css';

interface IProps {
	value: number;
	title: string;
	handleChange: Function;
}

export default function Score(props: IProps) {
	function handleDecrease() {
		props.handleChange(props.value - 1);
	}
	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		props.handleChange(Number(event.target.value));
	}
	function handleIncrease() {
		props.handleChange(props.value + 1);
	}

	return(
		<div>
			<p className={styles.title}>{props.title && props.title}</p>
			<InputCounter
				handleDecrease={() => handleDecrease()}
				handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
				handleIncrease={() => handleIncrease()}
				value={props.value}
			/>
		</div>
	)
}