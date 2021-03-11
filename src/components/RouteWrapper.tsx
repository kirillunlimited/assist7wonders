import React from 'react';
import { Box, Container, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  children: React.ReactNode;
};

const useStyles = makeStyles(theme => ({
  card: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(4),
    },
  },
}));

export default function RouteWrapper(props: Props) {
  const classes = useStyles();

  return (
    <Box width="100%" overflow="auto">
      <Container maxWidth="md" disableGutters>
        <Card className={classes.card} elevation={3}>
          {props.children}
        </Card>
      </Container>
    </Box>
  );
}
