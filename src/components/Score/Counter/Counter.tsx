import * as React from 'react';
import {IconButton, Input} from '@material-ui/core';
import {AddCircle, RemoveCircle} from '@material-ui/icons';
import {useEffect, useState} from "react";

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
		const value = props.isMaxValueFilter(Number(event.target.value), props.max) ? String(props.max) : event.target.value;
		setLocalValue(value || '0'); // empty string should be set to '0'
		props.handleChange(Number(value));
	}

	return (
		<div>
			<IconButton onClick={props.handleDecrement}>
				<RemoveCircle color="primary"/>
			</IconButton>
			<Input
				style={{width: 64}}
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
				<AddCircle color={props.isMaxValueFilter(Number(localValue), props.max) ? 'disabled' : 'primary'} />
			</IconButton>
		</div>
	)
}