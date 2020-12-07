import React, {useContext} from "react";
import NewPlayer from '../../components/NewPlayer/NewPlayer';
import {getTotalSum} from "../../utils/score";
import {Button, IconButton} from "@material-ui/core";
import {DeleteForever} from "@material-ui/icons";
import {IAddons} from '../../types';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ADDONS from "../../config/addons";
import {PlayersContext, AddonsContext} from "../App/App";

export default function Home() {
	const playersContext = useContext(PlayersContext);
	const addonsContext = useContext(AddonsContext);

	function onNewPlayerSubmit(name: string) {
		playersContext.dispatch({type: 'ADD', payload: name});
	}
	function onPlayerDelete(name: string) {
		playersContext.dispatch({type: 'DELETE', payload: name});
	}
	function onResetGame() {
		playersContext.dispatch({type: 'RESET'});
	}
	function onAddonToggle(event: React.ChangeEvent<HTMLInputElement>, addon: keyof IAddons) {
		addonsContext.dispatch({type: 'TOGGLE', payload: {addon, value: event.target.checked}});
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
			<Button variant="contained" color="primary" onClick={onResetGame}>
				Новая игра
			</Button>

			<FormGroup row>
				{ADDONS.map(addon =>
					<FormControlLabel
						key={addon.key}
						control={
							<Checkbox
								checked={addonsContext.state[addon.key]}
								name={addon.key}
								onChange={(e) => onAddonToggle(e, addon.key)}
							/>
						}
						label={addon.label}
				/>)}
			</FormGroup>

			<NewPlayer
				names={playersContext.state.map(player => player.name)}
				handleSubmit={onNewPlayerSubmit}
			/>
		</div>
	);
}