import * as React from 'react';
import {IconButton, Input} from '@material-ui/core';
import {AddCircle, RemoveCircle} from '@material-ui/icons';

interface IProps {
	handleDecrement: Function;
	handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	handleIncrement: () => void;
	value: number;
}

export default function InputCounter(props: IProps) {
	return (
		<div>
			<IconButton onClick={() => props.handleDecrement()}>
				<RemoveCircle color="primary"/>
			</IconButton>
			<Input style={{width: 64}} type='number' onChange={(e) => props.handleChange(e)} value={props.value} />
			<IconButton onClick={() => props.handleIncrement()}>
				<AddCircle color="primary"/>
			</IconButton>
		</div>
	)
}