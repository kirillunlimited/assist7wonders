import React, { useContext, useState } from 'react';
import NewPlayer from '../../components/NewPlayer/NewPlayer';
import { IconButton } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { PlayersContext } from '../App/App';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import styles from './Players.module.css';
import Profile from '../../components/Profile/Profile';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import WonderSelect from '../../components/WonderSelect/WonderSelect';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { TPlayers } from '../../types';

const useStyles = makeStyles(() => ({
  subtitle: {
    marginTop: '1em',
  },
}));

const reorder = (list: TPlayers, startIndex: number, endIndex: number): TPlayers => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function Players() {
  const playersContext = useContext(PlayersContext);
  const classes = useStyles();
  const { t } = useTranslation();

  function onNewPlayerSubmit(name: string, wonder: string) {
    playersContext.dispatch({ type: 'ADD', payload: { name, wonder } });
  }

  function deletePlayer(name: string) {
    playersContext.dispatch({ type: 'DELETE', payload: name });
  }

  const [isDeleteConfirmOpened, setIsDeleteConfirmOpened] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState('');

  function handleOpenConfirm(name: string) {
    setPlayerToDelete(name);
    setIsDeleteConfirmOpened(true);
  }

  function handleDeleteConfirm() {
    deletePlayer(playerToDelete);
    handleCloseConfirm();
  }

  function handleCloseConfirm() {
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
                                selectedWonders={playersContext.state.map(player => player.wonder)}
                                onSelect={wonder => handleWonderChange(player.name, wonder)}
                              />
                            </TableCell>
                            <TableCell className={`${styles.td} ${styles.delete}`}>
                              <IconButton onClick={() => handleOpenConfirm(player.name)}>
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

      <Dialog
        open={isDeleteConfirmOpened}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle>{t('deletingPlayer')}</DialogTitle>
        <DialogContent>
          <DialogContentText
            dangerouslySetInnerHTML={{
              __html: t('deletingPlayerDescription', { name: playerToDelete }),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            {t('no')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>

      <NewPlayer
        names={playersContext.state.map(player => player.name)}
        wonders={playersContext.state.map(player => player.wonder)}
        handleSubmit={onNewPlayerSubmit}
      />
    </div>
  );
}
