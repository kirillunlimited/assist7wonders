import React, { useContext, useState } from 'react';
import {
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Typography,
  Snackbar,
} from '@material-ui/core';
import NewPlayer from '../components/NewPlayer';
import Profile from '../components/Profile';
import WonderSelect from '../components/WonderSelect';
import { DeleteForever, Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Player } from '../types';
import { GameContext, PlayersContext } from './App';

const useStyles = makeStyles({
  subtitle: {
    marginTop: '1em',
  },
  player: {
    padding: 0,
    cursor: 'move',
  },
  wonder: {
    width: '100%',
  },
  delete: {
    width: '100%',
    padding: 0,
    textAlign: 'right',
  },
});

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
      <Typography variant="subtitle1" component="p">
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
                            <TableCell className={classes.player} {...provided.dragHandleProps}>
                              <Profile name={player.name} />
                            </TableCell>
                            <TableCell className={classes.wonder}>
                              <WonderSelect
                                value={player.wonder}
                                wonders={gameContext.state.wonders}
                                selectedWonders={playersContext.state.map(player => player.wonder)}
                                onSelect={wonder => handleWonderChange(player.name, wonder)}
                              />
                            </TableCell>
                            <TableCell className={classes.delete}>
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
      ) : null}

      {playersContext.state.length < 2 ? (
        <Typography variant="subtitle1" className={classes.subtitle} component="p">
          {t('addMinPlayers')}
        </Typography>
      ) : null}

      <NewPlayer
        names={playersContext.state.map(player => player.name)}
        wonders={gameContext.state.wonders}
        selectedWonders={playersContext.state.map(player => player.wonder)}
        isMax={playersContext.state.length >= gameContext.state.maxPlayers}
        onSubmit={handleSubmit}
      />

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
          <>
            <Button color="secondary" size="small" onClick={handleRestorePlayer}>
              {t('restore')}
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseConfirm}
            >
              <Close fontSize="small" />
            </IconButton>
          </>
        }
      />
    </div>
  );
}
