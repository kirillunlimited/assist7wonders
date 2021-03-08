import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { useTheme, makeStyles, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { blue } from '@material-ui/core/colors';
import { getAvatarText } from '../../utils/game';

interface Props {
  name: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
  },
  player: {
    display: 'flex',
    alignItems: 'center',
    minWidth: '124px',
  },
  playerSmall: {
    flexDirection: 'column',
    minWidth: '76px',
  },
  name: {
    marginLeft: '0.5em',
  },
  nameSmall: {
    margin: 0,
    textAlign: 'center',
  },
}));

export default function Scores(props: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const avatarText = getAvatarText(props.name);

  return (
    <div className={`${classes.player} ${!bigScreen ? classes.playerSmall : ''}`}>
      <Avatar className={classes.avatar} alt={props.name}>
        {avatarText}
      </Avatar>
      <div className={`${classes.name} ${!bigScreen ? classes.nameSmall : ''}`}>
        <Typography variant="body2">{props.name}</Typography>
      </div>
    </div>
  );
}
