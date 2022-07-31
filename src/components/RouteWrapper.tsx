import React from 'react';
import { Box, Container, Card } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

export default function RouteWrapper(props: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'auto',
      }}
    >
      <Container maxWidth="md" disableGutters>
        <Card
          sx={{
            padding: 2,
            m: { sm: 4 },
          }}
          elevation={3}
        >
          {props.children}
        </Card>
      </Container>
    </Box>
  );
}
