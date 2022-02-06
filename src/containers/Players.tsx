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
import { CurrentGameContext, GamesContext } from './App';

const useStyles = makeStyles(theme => ({
  subtitle: {
    marginTop: theme.spacing(2),
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
}));

const reorder = (list: Player[], startIndex: number, endIndex: number): Player[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function Players() {
  const gamesContext = useContext(GamesContext);
  const {currentGameState, currentGamePlayers} = useContext(CurrentGameContext);
  const [isDeleteConfirmOpened, setIsDeleteConfirmOpened] = useState(false);
  const [deletedPlayer, setDeletedPlayer] = useState({
    player: null,
    index: -1,
  } as { player: Player | null; index: number });
  const classes = useStyles();
  const { t } = useTranslation();

  function handleSubmit(name: string, wonder: string) {
    gamesContext.dispatch({ type: 'ADD_PLAYER', payload: {
      gameId: currentGameState?.gameId,
      name,
      wonder
    } });
  }

  function handleDeletePlayer(name: string) {
    let playerIndex = -1;
    const deletedPlayer = currentGamePlayers.find((player, index) => {
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

      gamesContext.dispatch({
        type: 'DELETE_PLAYER', payload: {
          gameId: currentGameState?.gameId,
          name
        }
      });
    }
  }

  function handleRestorePlayer() {
    if (deletedPlayer?.player) {
      setIsDeleteConfirmOpened(false);
      gamesContext.dispatch({ type: 'RESTORE_PLAYER', payload: {
        gameId: currentGameState?.gameId,
        player: deletedPlayer.player,
        index: deletedPlayer.index
      } });
    }
  }

  function handleCloseConfirm(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setIsDeleteConfirmOpened(false);
  }

  function handleWonderChange(name: string, wonder: string) {
    gamesContext.dispatch({ type: 'SET_PLAYER_WONDER', payload: { gameId: currentGameState.gameId, name, wonder } });
  }

  function onDragEnd(result: DropResult): void {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedPlayers = reorder(
      currentGamePlayers,
      result.source.index,
      result.destination.index
    );

    gamesContext.dispatch({
      type: 'SET_PLAYERS', payload: {
        gameId: currentGameState.gameId,
        players: reorderedPlayers
      }
    });
  }

  return (
    <div>
      <Typography variant="subtitle1" component="p">
        {currentGamePlayers.length} / {currentGameState?.maxPlayers}
      </Typography>
      {currentGamePlayers.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <TableContainer {...provided.droppableProps} ref={provided.innerRef}>
                <Table>
                  <TableBody>
                    {currentGamePlayers.map((player, index) => (
                      <Draggable key={player.name} draggableId={player.name} index={index}>
                        {provided => (
                          <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                            <TableCell className={classes.player} {...provided.dragHandleProps}>
                              <Profile name={player.name} />
                            </TableCell>
                            <TableCell className={classes.wonder}>
                              <WonderSelect
                                value={player.wonder}
                                wonders={currentGameState.wonders}
                                selectedWonders={currentGamePlayers.map(player => player.wonder)}
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

      {currentGamePlayers.length < 2 ? (
        <Typography variant="subtitle1" className={classes.subtitle} component="p">
          {t('addMinPlayers')}
        </Typography>
      ) : null}

      <NewPlayer
        names={currentGamePlayers.map(player => player.name)}
        wonders={currentGameState.wonders}
        selectedWonders={currentGamePlayers.map(player => player.wonder)}
        isMax={currentGamePlayers.length >= currentGameState.maxPlayers}
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
