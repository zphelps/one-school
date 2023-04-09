import type { FC } from 'react';
import { Box, Typography } from '@mui/material';
import EmptyConversation from '../../assets/error-404.png';

export const ConversationBlank: FC = () => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden'
    }}
  >
    <Box
      component="img"
      src={EmptyConversation}
      sx={{
        height: 'auto',
        maxWidth: 120
      }}
    />
    <Typography
      color="text.secondary"
      sx={{ mt: 2 }}
      variant="subtitle1"
    >
      Start meaningful conversations!
    </Typography>
  </Box>
);
