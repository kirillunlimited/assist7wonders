import * as React from 'react';
import {IconButton, Input} from '@material-ui/core';
import {AddCircle, RemoveCircle} from '@material-ui/icons';

interface IProps {
	handleDecrease?: Function;
	handleChange?: Function;
	handleIncrease?: Function;
	value: number;
}

export default function InputCounter(props: IProps) {
	return (
		<div>
			<IconButton onClick={(e) => props.handleDecrease && props.handleDecrease(e)}>
				<RemoveCircle color="primary"/>
			</IconButton>
			<Input type='number' onChange={(e) => props.handleChange && props.handleChange(e)} value={props.value} />
			<IconButton onClick={(e) => props.handleIncrease && props.handleIncrease(e)}>
				<AddCircle color="primary"/>
			</IconButton>
		</div>
	)
}