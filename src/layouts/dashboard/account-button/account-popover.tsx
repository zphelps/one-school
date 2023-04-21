import type { FC } from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import CreditCard01Icon from '@untitled-ui/icons-react/build/esm/CreditCard01';
import Settings04Icon from '@untitled-ui/icons-react/build/esm/Settings04';
import User03Icon from '@untitled-ui/icons-react/build/esm/User03';
import {
  Box,
  Button,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  SvgIcon,
  Typography
} from '@mui/material';
import {useRouter} from "../../../hooks/use-router";
import {useAuth} from "../../../hooks/use-auth";
import {paths} from "../../../paths";
import {RouterLink} from "../../../components/router-link";

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = useCallback(
    async (): Promise<void> => {
      try {
        onClose?.();

        await auth.signOut();

        router.replace(paths.index);
        router.refresh();
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
      }
    },
    [auth, router, onClose]
  );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      {...other}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">
          {auth.user?.name}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
            {auth.user?.email}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>
        {/*<ListItemButton*/}
        {/*  component={RouterLink}*/}
        {/*  href={paths.index}*/}
        {/*  onClick={onClose}*/}
        {/*  sx={{*/}
        {/*    borderRadius: 1,*/}
        {/*    px: 1,*/}
        {/*    py: 0.5*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <ListItemIcon>*/}
        {/*    <SvgIcon fontSize="small">*/}
        {/*      <User03Icon />*/}
        {/*    </SvgIcon>*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText*/}
        {/*    primary={(*/}
        {/*      <Typography variant="body1">*/}
        {/*        Profile*/}
        {/*      </Typography>*/}
        {/*    )}*/}
        {/*  />*/}
        {/*</ListItemButton>*/}
        <ListItemButton
          component={RouterLink}
          href={paths.settings}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <Settings04Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="body1">
                Settings
              </Typography>
            )}
          />
        </ListItemButton>
        {/*<ListItemButton*/}
        {/*  component={RouterLink}*/}
        {/*  href={paths.index}*/}
        {/*  onClick={onClose}*/}
        {/*  sx={{*/}
        {/*    borderRadius: 1,*/}
        {/*    px: 1,*/}
        {/*    py: 0.5*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <ListItemIcon>*/}
        {/*    <SvgIcon fontSize="small">*/}
        {/*      <CreditCard01Icon />*/}
        {/*    </SvgIcon>*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText*/}
        {/*    primary={(*/}
        {/*      <Typography variant="body1">*/}
        {/*        Billing*/}
        {/*      </Typography>*/}
        {/*    )}*/}
        {/*  />*/}
        {/*</ListItemButton>*/}
      </Box>
      <Divider sx={{ my: '0 !important' }} />
      <Box
        sx={{
          display: 'flex',
          p: 1,
          justifyContent: 'center'
        }}
      >
        <Button
          color="inherit"
          onClick={handleLogout}
          size="small"
        >
          Logout
        </Button>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
