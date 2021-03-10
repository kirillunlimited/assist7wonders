import React, { useContext, useState } from 'react';
import NewPlayer from '../../components/NewPlayer/NewPlayer';
import { IconButton } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { GameContext, PlayersContext } from '../App/App';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import styles from './Players.module.css';
import Profile from '../../components/Profile/Profile';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import WonderSelect from '../../components/WonderSelect/WonderSelect';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Player } from '../../types';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles(() => ({
  subtitle: {
    marginTop: '1em',
  },
}));

const reorder = (list: Player[], startIndex: number, endIndex: number): Player[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function Players() {
  const playersContext = useContext(PlayersContext);
  const gameContext = useContext(GameContext);
  const [isDeleteConfirmOpened, setIsDeleteConfirmOpened] = useState(false);
  const [deletedPlayer, setDeletedPlayer] = useState({
    player: null,
    index: -1,
  } as { player: Player | null; index: number });
  const classes = useStyles();
  const { t } = useTranslation();

  function handleSubmit(name: string, wonder: string) {
    playersContext.dispatch({ type: 'ADD', payload: { name, wonder } });
  }

  function handleDeletePlayer(name: string) {
    let playerIndex = -1;
    const deletedPlayer = playersContext.state.find((player, index) => {
      if (player.name === name) {
        playerIndex = index;
        return true;
      }
      return false;
    });
    if (deletedPlayer) {
      setDeletedPlayer({
        player: deletedPlayer,
        index: playerIndex,
      });
      setIsDeleteConfirmOpened(true);
      playersContext.dispatch({ type: 'DELETE', payload: name });
    }
  }

  function handleRestorePlayer() {
    setIsDeleteConfirmOpened(false);
    playersContext.dispatch({ type: 'RESTORE', payload: deletedPlayer });
  }

  function handleCloseConfirm(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setIsDeleteConfirmOpened(false);
  }

  function handleWonderChange(name: string, wonder: string) {
    playersContext.dispatch({ type: 'SET_WONDER', payload: { name, wonder } });
  }

  function onDragEnd(result: DropResult): void {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedPlayers = reorder(
      playersContext.state,
      result.source.index,
      result.destination.index
    );

    playersContext.dispatch({ type: 'SET', payload: reorderedPlayers });
  }

  return (
    <div>
      <Typography variant="subtitle1">
        {playersContext.state.length} / {gameContext.state.maxPlayers}
      </Typography>
      {playersContext.state.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <TableContainer {...provided.droppableProps} ref={provided.innerRef}>
                <Table>
                  <TableBody>
                    {playersContext.state.map((player, index) => (
                      <Draggable key={player.name} draggableId={player.name} index={index}>
                        {provided => (
                          <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                            <TableCell
                              className={`${styles.td} ${styles.player}`}
                              {...provided.dragHandleProps}
                            >
                              <Profile name={player.name} />
                            </TableCell>
                            <TableCell className={`${styles.td} ${styles.wonder}`}>
                              <WonderSelect
                                value={player.wonder}
                                wonders={gameContext.state.wonders}
                                selectedWonders={playersContext.state.map(player => player.wonder)}
                                onSelect={wonder => handleWonderChange(player.name, wonder)}
                              />
                            </TableCell>
                            <TableCell className={`${styles.td} ${styles.delete}`}>
                              <IconButton onClick={() => handleDeletePlayer(player.name)}>
                                <Tooltip title={t('deletePlayer') || ''}>
                                  <DeleteForever fontSize="large" color="secondary" />
                                </Tooltip>
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Typography variant="subtitle1">{t('addPlayers')}</Typography>
      )}

      {playersContext.state.length === 1 ? (
        <Typography variant="subtitle1" className={classes.subtitle}>
          {t('addMorePlayers')}
        </Typography>
      ) : null}

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isDeleteConfirmOpened}
        autoHideDuration={6000}
        onClose={handleCloseConfirm}
        message={
          <span
            dangerouslySetInnerHTML={{
              __html: t('deletingPlayerDescription', { name: deletedPlayer?.player?.name }),
            }}
          />
        }
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleRestorePlayer}>
              {t('restore')}
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseConfirm}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />

      <NewPlayer
        names={playersContext.state.map(player => player.name)}
        wonders={gameContext.state.wonders}
        selectedWonders={playersContext.state.map(player => player.wonder)}
        isMax={playersContext.state.length >= gameContext.state.maxPlayers}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
