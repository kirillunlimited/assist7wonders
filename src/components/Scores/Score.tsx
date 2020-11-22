import * as React from 'react';
import InputCounter from "./InputCounter";
import styles from './Score.module.css';

interface IProps {
	value: number;
	title: string;
	handleChange: (value: number) => void;
}

export default function Score(props: IProps) {
	function handleDecrement(): void {
		props.handleChange(props.value - 1);
	}
	function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		props.handleChange(Number(event.target.value));
	}
	function handleIncrement(): void {
		props.handleChange(props.value + 1);
	}

	return(
		<div>
			{props.title && <p className={styles.title}>{props.title}</p>}
			<InputCounter
				handleDecrement={() => handleDecrement()}
				handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(e)}
				handleIncrement={() => handleIncrement()}
				value={props.value}
			/>
		</div>
	)
}