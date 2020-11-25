import React from "react";
import NewPlayer from './NewPlayer';
import {getSum} from "../../utils/score";
import {Button, IconButton} from "@material-ui/core";
import {DeleteForever} from "@material-ui/icons";
import {IPlayer, IAddons} from "../../types";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ADDONS from "../../addons";

interface IProps {
	players: Array<IPlayer>;
	handleAdd: (name: string) => void;
	handleDelete: (name: string) => void;
	handleReset: () => void;
	addons: IAddons;
	handleAddonToggle: (addon: keyof IAddons, value: boolean) => void;
}

export default function Home(props: IProps) {
	function onAddonToggle(event: React.ChangeEvent<HTMLInputElement>, addon: keyof IAddons) {
		props.handleAddonToggle(addon, event.target.checked);
	}

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

			<FormGroup row>
				{(Object.keys(props.addons) as Array<keyof IAddons>).map(addon =>
					<FormControlLabel
						key={addon}
						control={
							<Checkbox
								checked={props.addons[addon]}
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