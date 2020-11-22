import * as React from 'react';
import {useState} from 'react';
import {Button, Input} from '@material-ui/core';

interface IProps {
	handleSubmit: Function;
}

export default function NewPlayer(props: IProps) {
	const [name, setName] = useState('');

	return(
		<form onSubmit={(e) => {
			e.preventDefault();
			props.handleSubmit(name);
			setName('');
		}}>
			<Input onChange={(event) => setName(event.target.value)} value={name} autoFocus />
			<Button variant="contained" color="primary" type="submit">
				Добавить
			</Button>
		</form>
	)
}