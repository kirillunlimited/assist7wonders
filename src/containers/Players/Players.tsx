import React, {useContext, useState} from "react";
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
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function Players() {
	const playersContext = useContext(PlayersContext);

	function onNewPlayerSubmit(name: string) {
		playersContext.dispatch({type: 'ADD', payload: name});
	}
	function deletePlayer(name: string) {
		playersContext.dispatch({type: 'DELETE', payload: name});
	}

	const [isDeleteConfirmOpened, setIsDeleteConfirmOpened] = useState(false);
	const [playerToDelete, setPlayerToDelete] = useState('');

	function handleOpenConfirm (name: string) {
		setPlayerToDelete(name);
		setIsDeleteConfirmOpened(true);
	}
	function handleDeleteConfirm() {
		deletePlayer(playerToDelete);
		handleCloseConfirm();
	}
	function handleCloseConfirm() {
		setPlayerToDelete('');
		setIsDeleteConfirmOpened(false);
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
										<IconButton onClick={() => handleOpenConfirm(player.name)}>
											<Tooltip title="Удалить игрока">
												<DeleteForever fontSize="large" color="secondary"/>
											</Tooltip>
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

			<Dialog
				open={isDeleteConfirmOpened}
				onClose={handleCloseConfirm}
				aria-labelledby="alert-dialog-title"
			>
				<DialogTitle>Удаление игрока</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Игрок <strong>{playerToDelete}</strong> будет удален, вы уверены?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseConfirm} color="primary">Нет</Button>
					<Button onClick={handleDeleteConfirm} color="primary" autoFocus>Да</Button>
				</DialogActions>
			</Dialog>

			<NewPlayer
				names={playersContext.state.map(player => player.name)}
				handleSubmit={onNewPlayerSubmit}
			/>
		</div>
	);
}