import * as React from 'react';
import {IconButton, Input} from '@material-ui/core';
import {AddCircle, RemoveCircle} from '@material-ui/icons';
import {useEffect, useState} from "react";

interface IProps {
	handleDecrement: Function;
	handleChange: (value: number) => void;
	handleIncrement: () => void;
	value: number;
}

export default function InputCounter(props: IProps) {
	const [localValue, setLocalValue] = useState(String(props.value));

	useEffect(() => {
		setLocalValue(String(props.value));
	}, [props.value])

	function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setLocalValue(event.target.value);
	}

	function onBlur(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setLocalValue(event.target.value || '0'); // empty string should be set to '0'
		props.handleChange(Number(localValue));
	}

	return (
		<div>
			<IconButton onClick={() => props.handleDecrement()}>
				<RemoveCircle color="primary"/>
			</IconButton>
			<Input
				style={{width: 64}}
				type='number'
				onChange={onChange}
				onBlur={onBlur}
				value={localValue}
			/>
			<IconButton onClick={() => props.handleIncrement()}>
				<AddCircle color="primary"/>
			</IconButton>
		</div>
	)
}