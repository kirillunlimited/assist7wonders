import React from 'react';
import { Box } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

export default function Layout(props: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: { xs: 'column', sm: 'row' },
        paddingTop: { xs: '56px', sm: '64px' },
      }}
    >
      {props.children}
    </Box>
  );
}
