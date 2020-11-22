import React from "react";
import NewPlayer from './NewPlayer';
import {getSum} from "../../utils/score";
import {Button, IconButton} from "@material-ui/core";
import {DeleteForever} from "@material-ui/icons";
import {IPlayer} from "../../types";

interface IProps {
	players: Array<IPlayer>;
	handleAdd: (name: string) => void;
	handleDelete: (name: string) => void;
	handleReset: () => void;
}

export default function Home(props: IProps) {
	return(
		<div>
			<NewPlayer
				names={props.players.map(player => player.name)}
				handleSubmit={props.handleAdd}
			/>
			<div>
				{props.players.map((player, index) =>
					<div key={index}>
						{player.name} Σ{getSum(player.score)}
						<IconButton onClick={() => props.handleDelete(player.name)}>
							<DeleteForever color="secondary"/>
						</IconButton>
					</div>)
				}
			</div>
			<Button variant="contained" color="primary" onClick={() => props.handleReset()}>
				Новая игра
			</Button>
		</div>
	);
}