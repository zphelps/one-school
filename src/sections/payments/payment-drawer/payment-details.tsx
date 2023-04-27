import type { FC } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import type { Theme } from '@mui/material';
import {
  Button,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery
} from '@mui/material';
import {Payment, PaymentStatus} from "../../../types/payment";
import {SeverityPill, SeverityPillColor} from "../../../components/severity-pill";
import {Scrollbar} from "../../../components/scrollbar";
import {useAuth} from "../../../hooks/use-auth";
import {useCallback} from "react";
import {PropertyList} from "../../../components/property-list";
import {PropertyListItem} from "../../../components/property-list-item";

const statusMap: Record<PaymentStatus, string> = {
  paid: 'success',
  upcoming: 'info',
  // canceled: 'warning',
  overdue: 'error'
};

interface OrderDetailsProps {
  onApprove?: () => void;
  onEdit?: () => void;
  onReject?: () => void;
  payment: Payment;
}

export const PaymentDetails: FC<OrderDetailsProps> = (props) => {
  const { onApprove, onEdit, onReject, payment } = props;
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const auth = useAuth();

  const getStatus = useCallback((payment: Payment) => {
    if(payment.userIdsPaid.includes(auth.user?.id as string)) {
      return 'paid';
    } else if (payment.issuedOn < new Date().getTime()) {
      return 'overdue';
    } else {
      return 'upcoming';
    }
  }, [payment])

  const align = lgUp ? 'horizontal' : 'vertical';
  const items = payment.lineItems || [];
  const createdAt = format(payment.issuedOn, 'dd/MM/yyyy HH:mm');
  const statusColor = statusMap[getStatus(payment)] as SeverityPillColor;
  const totalAmount = numeral(payment
      .lineItems
      .reduce((total, lineItem) => total + lineItem.amount * lineItem.quantity, 0))
      .format(`$0,0.00`);

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Typography variant="h6">
            Details
          </Typography>
          {/*<Button*/}
          {/*  color="inherit"*/}
          {/*  onClick={onEdit}*/}
          {/*  size="small"*/}
          {/*  startIcon={(*/}
          {/*    <SvgIcon>*/}
          {/*      <Edit02Icon />*/}
          {/*    </SvgIcon>*/}
          {/*  )}*/}
          {/*>*/}
          {/*  Edit*/}
          {/*</Button>*/}
        </Stack>
        <PropertyList>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Name"
            value={payment.name}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Description"
            value={payment.description}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Issued On"
          >
            <Typography
              color="text.secondary"
              variant="body2"
            >
              {format(payment.issuedOn, 'MMM d, yyyy \'at\' h:mm aa')}
            </Typography>
          </PropertyListItem>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Due On"
            value={format(payment.dueOn, 'MMM d, yyyy \'at\' h:mm aa')}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Issued By"
            value={payment.target.name}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Total Amount"
            value={totalAmount}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Status"
          >
            <SeverityPill color={statusColor}>
              {getStatus(payment)}
            </SeverityPill>
          </PropertyListItem>
        </PropertyList>
        {/*<Stack*/}
        {/*  alignItems="center"*/}
        {/*  direction="row"*/}
        {/*  flexWrap="wrap"*/}
        {/*  justifyContent="flex-end"*/}
        {/*  spacing={2}*/}
        {/*>*/}
        {/*  <Button*/}
        {/*    onClick={onApprove}*/}
        {/*    size="small"*/}
        {/*    variant="contained"*/}
        {/*  >*/}
        {/*    Approve*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    color="error"*/}
        {/*    onClick={onReject}*/}
        {/*    size="small"*/}
        {/*    variant="outlined"*/}
        {/*  >*/}
        {/*    Reject*/}
        {/*  </Button>*/}
        {/*</Stack>*/}
      </Stack>
      <Stack spacing={3}>
        <Typography variant="h6">
          Line items
        </Typography>
        <Scrollbar>
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  Quanity
                </TableCell>
                <TableCell>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const unitAmount = numeral(item.amount).format(`$0,0.00`);

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.description}
                    </TableCell>
                    <TableCell>
                      {item.quantity}
                    </TableCell>
                    <TableCell>
                      {unitAmount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Stack>
    </Stack>
  );
};

PaymentDetails.propTypes = {
  onApprove: PropTypes.func,
  onEdit: PropTypes.func,
  onReject: PropTypes.func,
  // @ts-ignore
  payment: PropTypes.object
};
