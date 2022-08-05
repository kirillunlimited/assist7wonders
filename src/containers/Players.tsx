import React, { useContext } from 'react';
import {
  Box,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import NewPlayer from '../components/NewPlayer';
import Profile from '../components/Profile';
import WonderSelect from '../components/WonderSelect';
import { DeleteForever, Close, Shuffle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Player } from '../types';
import { CurrentGameContext, GamesContext } from './App';
import { getPlayersWithShuffledWonders } from '../utils/players';
import { useSnackbar, SnackbarKey } from 'notistack';

const reorder = (list: Player[], startIndex: number, endIndex: number): Player[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

type DeletedPlayer = {
  player: Player | null;
  index: number;
};

export default function Players() {
  const gamesContext = useContext(GamesContext);
  const { currentGameState, currentGameParams, currentGamePlayers } =
    useContext(CurrentGameContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();

  function handleSubmit(name: string, wonder: string) {
    gamesContext.dispatch({
      type: 'ADD_PLAYER',
      payload: {
        gameId: currentGameParams?.gameId,
        name,
        wonder,
      },
    });
  }

  function handleDeletePlayer(name: string) {
    const deletedPlayer = currentGamePlayers.reduce(
      (result, player, index) => {
        if (player.name === name) {
          return {
            player,
            index,
          };
        }
        return result;
      },
      { player: null, index: -1 } as DeletedPlayer
    );

    if (deletedPlayer) {
      enqueueSnackbar(
        <span
          dangerouslySetInnerHTML={{
            __html: t('deletingPlayerDescription', { name }),
          }}
        />,
        {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          autoHideDuration: 6000,
          action: snackbarId => (
            <>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => handleRestorePlayer(deletedPlayer, snackbarId)}
              >
                {t('restore')}
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => closeSnackbar(snackbarId)}
              >
                <Close fontSize="small" />
              </IconButton>
            </>
          ),
        }
      );

      gamesContext.dispatch({
        type: 'DELETE_PLAYER',
        payload: {
          gameId: currentGameParams?.gameId,
          name,
        },
      });
    }
  }

  function handleRestorePlayer(deletedPlayer: DeletedPlayer, snackbarId: SnackbarKey): void {
    if (deletedPlayer?.player) {
      closeSnackbar(snackbarId);
      gamesContext.dispatch({
        type: 'RESTORE_PLAYER',
        payload: {
          gameId: currentGameParams?.gameId,
          player: deletedPlayer.player,
          index: deletedPlayer.index,
        },
      });
    }
  }

  function handleShuffleWondersClick(): void {
    const players = getPlayersWithShuffledWonders(
      currentGameState.players,
      currentGameParams.wonders
    );
    gamesContext.dispatch({
      type: 'SET_PLAYERS',
      payload: { gameId: currentGameState.gameId, players },
    });
  }

  function handleWonderChange(name: string, wonder: string) {
    gamesContext.dispatch({
      type: 'SET_PLAYER_WONDER',
      payload: { gameId: currentGameParams.gameId, name, wonder },
    });
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
      type: 'SET_PLAYERS',
      payload: {
        gameId: currentGameParams.gameId,
        players: reorderedPlayers,
      },
    });
  }

  return (
    <div>
      <Typography variant="subtitle1" component="p">
        {currentGamePlayers.length} / {currentGameParams?.maxPlayers}
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
                            <TableCell
                              sx={{ py: 1, px: 0, cursor: 'move' }}
                              {...provided.dragHandleProps}
                            >
                              <Profile name={player.name} />
                            </TableCell>
                            <TableCell sx={{ width: '100%' }}>
                              <WonderSelect
                                variant="standard"
                                value={player.wonder}
                                wonders={currentGameParams.wonders}
                                selectedWonders={currentGamePlayers.map(player => player.wonder)}
                                onSelect={wonder => handleWonderChange(player.name, wonder)}
                              />
                            </TableCell>
                            <TableCell sx={{ width: '100%', padding: 0, textAlign: 'right' }}>
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
        <Alert sx={{ mt: 2 }} severity="warning">
          {t('addMinPlayers')}
        </Alert>
      ) : null}

      <Box sx={{ mt: 2 }}>
        {currentGamePlayers.length >= 2 && (
          <Button
            sx={{
              marginBottom: 2,
            }}
            variant="outlined"
            color="primary"
            aria-label="add"
            startIcon={<Shuffle />}
            onClick={handleShuffleWondersClick}
          >
            {t('shuffleWonders')}
          </Button>
        )}
        <NewPlayer
          names={currentGamePlayers.map(player => player.name)}
          wonders={currentGameParams.wonders}
          selectedWonders={currentGamePlayers.map(player => player.wonder)}
          isMax={currentGamePlayers.length >= currentGameParams.maxPlayers}
          onSubmit={handleSubmit}
        />
      </Box>
    </div>
  );
}
