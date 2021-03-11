import React from 'react';
import { Box, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

type Props = {
  children: React.ReactNode;
};

const useStyles = makeStyles(theme => ({
  layout: {
    paddingTop: '56px',
    [theme.breakpoints.up('sm')]: {
      paddingTop: '64px',
    },
  },
}));

export default function Layout(props: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection={bigScreen ? 'row' : 'column'}
      className={classes.layout}
    >
      {props.children}
    </Box>
  );
}
