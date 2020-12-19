import React, {useContext} from "react";
import NewPlayer from '../../components/NewPlayer/NewPlayer';
import {getTotalSum} from "../../utils/score";
import {IconButton} from "@material-ui/core";
import {DeleteForever} from "@material-ui/icons";
import {PlayersContext} from "../App/App";

export default function Players() {
	const playersContext = useContext(PlayersContext);

	function onNewPlayerSubmit(name: string) {
		playersContext.dispatch({type: 'ADD', payload: name});
	}
	function onPlayerDelete(name: string) {
		playersContext.dispatch({type: 'DELETE', payload: name});
	}

	return(
		<div>
			<div>
				{playersContext.state.map((player, index) =>
					<div key={index}>
						{player.name} Σ{getTotalSum(player.score)}
						<IconButton onClick={() => onPlayerDelete(player.name)}>
							<DeleteForever color="secondary"/>
						</IconButton>
					</div>)
				}
			</div>

			<NewPlayer
				names={playersContext.state.map(player => player.name)}
				handleSubmit={onNewPlayerSubmit}
			/>
		</div>
	);
}