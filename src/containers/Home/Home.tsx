import React, {useContext} from "react";
import NewPlayer from '../../components/NewPlayer/NewPlayer';
import {getSum} from "../../utils/score";
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

	function onAddonToggle(event: React.ChangeEvent<HTMLInputElement>, addon: keyof IAddons) {
		addonsContext.dispatch({type: 'toggle', payload: {addon, value: event.target.checked}});
	}

	return(
		<div>
			<NewPlayer
				names={playersContext.state.map(player => player.name)}
				handleSubmit={(name) => playersContext.dispatch({type: 'add', payload: name})}
			/>
			<div>
				{playersContext.state.map((player, index) =>
					<div key={index}>
						{player.name} Σ{getSum(player.score)}
						<IconButton onClick={() => playersContext.dispatch({type: 'delete', payload: player.name})}>
							<DeleteForever color="secondary"/>
						</IconButton>
					</div>)
				}
			</div>
			<Button variant="contained" color="primary" onClick={() => playersContext.dispatch({type: 'reset'})}>
				Новая игра
			</Button>

			<FormGroup row>
				{(Object.keys(addonsContext.state) as Array<keyof IAddons>).map(addon =>
					<FormControlLabel
						key={addon}
						control={
							<Checkbox
								checked={addonsContext.state[addon]}
								name={addon}
								onChange={(e) => onAddonToggle(e, addon)}
							/>
						}
						label={ADDONS[addon].label}
				/>)}
			</FormGroup>
		</div>
	);
}