import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { getAvatarText } from '../utils/players';

type Props = {
  name: string;
};

export default function Scores(props: Props) {
  const avatarText = getAvatarText(props.name);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minWidth: { xs: '76px', sm: '124px' },
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <Avatar
        sx={{
          backgroundColor: theme => theme.palette.primary.main,
          color: theme => theme.palette.getContrastText(theme.palette.primary.main),
        }}
        alt={props.name}
      >
        {avatarText}
      </Avatar>
      <Box
        sx={{
          ml: { sm: 1 },
          m: { xs: 0 },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Typography variant="body2">{props.name}</Typography>
      </Box>
    </Box>
  );
}
