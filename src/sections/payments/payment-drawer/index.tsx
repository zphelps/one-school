import type { FC } from 'react';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import type { Theme } from '@mui/material';
import { Box, Drawer, IconButton, Stack, SvgIcon, Typography, useMediaQuery } from '@mui/material';
import { PaymentDetails } from './payment-details';
import {Payment} from "../../../types/payment";

interface PaymentDrawerProps {
  container?: HTMLDivElement | null;
  open?: boolean;
  onClose?: () => void;
  payment?: Payment;
}

export const PaymentDrawer: FC<PaymentDrawerProps> = (props) => {
  const { container, onClose, open, payment } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const handleEditOpen = useCallback(
    () => {
      setIsEditing(true);
    },
    []
  );

  const handleEditCancel = useCallback(
    () => {
      setIsEditing(false);
    },
    []
  );

  let content: JSX.Element | null = null;

  if (payment) {
    content = (
      <div>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{
            px: 3,
            py: 2
          }}
        >
          <Typography
            color="inherit"
            variant="h6"
          >
            {payment.name}
          </Typography>
          <IconButton
            color="inherit"
            onClick={onClose}
          >
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
        <Box
          sx={{
            px: 3,
            py: 4
          }}
        >
          {
            !isEditing
              ? (
                <PaymentDetails
                  onApprove={onClose}
                  onEdit={handleEditOpen}
                  onReject={onClose}
                  payment={payment}
                />
              )
              : ( <div></div>
                // <OrderEdit
                //   onCancel={handleEditCancel}
                //   onSave={handleEditCancel}
                //   order={payment}
                // />
              )
          }
        </Box>
      </div>
    );
  }

  if (lgUp) {
    return (
      <Drawer
        anchor="right"
        open={open}
        PaperProps={{
          sx: {
            position: 'relative',
            width: 500
          }
        }}
        SlideProps={{ container }}
        variant="persistent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      hideBackdrop
      ModalProps={{
        container,
        sx: {
          pointerEvents: 'none',
          position: 'absolute'
        }
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: '100%',
          width: 400,
          pointerEvents: 'auto',
          position: 'absolute'
        }
      }}
      SlideProps={{ container }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

PaymentDrawer.propTypes = {
  container: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  // @ts-ignore
  payment: PropTypes.object
};
