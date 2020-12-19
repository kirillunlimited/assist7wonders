import React, {useContext} from "react";
import NewPlayer from '../../components/NewPlayer/NewPlayer';
import {IconButton} from "@material-ui/core";
import {DeleteForever} from "@material-ui/icons";
import {PlayersContext} from "../App/App";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import styles from "./Players.module.css";
import Profile from "../../components/Profile/Profile";

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
			{playersContext.state.length ?
				<TableContainer>
					<Table>
						<TableBody>
							{playersContext.state.map((player) =>
								<TableRow key={player.name}>
									<TableCell className={styles.td}>
										<Profile name={player.name} />
									</TableCell>
									<TableCell className={styles.td}>
										<IconButton onClick={() => onPlayerDelete(player.name)}>
											<DeleteForever fontSize="large" color="secondary"/>
										</IconButton>
									</TableCell>
								</TableRow>)
							}
						</TableBody>
					</Table>
				</TableContainer>
				: <p>Добавьте игроков</p>
			}

			{playersContext.state.length === 1 ? <p>Добавьте больше игроков</p> : null}

			<NewPlayer
				names={playersContext.state.map(player => player.name)}
				handleSubmit={onNewPlayerSubmit}
			/>
		</div>
	);
}