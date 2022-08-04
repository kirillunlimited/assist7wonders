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
        minWidth: { xs: '5em', sm: '9em' },
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <Avatar
        sx={{
          backgroundColor: theme => theme.palette.primary.main,
          color: theme => theme.palette.primary.contrastText,
        }}
        alt={props.name}
      >
        {avatarText}
      </Avatar>
      <Box
        sx={{
          ml: { xs: 0, sm: 1 },
          mt: { xs: 1, sm: 0 },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Typography
          sx={{
            lineHeight: { xs: 1.3 },
          }}
          variant="body2"
        >
          {props.name}
        </Typography>
      </Box>
    </Box>
  );
}
