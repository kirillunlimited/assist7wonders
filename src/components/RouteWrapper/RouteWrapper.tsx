import * as React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

interface IProps {
  children: JSX.Element;
}

const useStyles = makeStyles(theme => ({
  card: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(4),
    },
  },
}));

export default function RouteWrapper(props: IProps) {
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
