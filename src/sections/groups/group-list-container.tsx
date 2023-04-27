import { styled } from '@mui/material/styles';

export const GroupListContainer = styled(
  'div',
  { shouldForwardProp: (prop) => prop !== 'open' }
)<{}>(
  ({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    zIndex: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
  })
);
