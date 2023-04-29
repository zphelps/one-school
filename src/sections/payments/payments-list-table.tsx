import type { ChangeEvent, FC, MouseEvent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import {
  Box, Checkbox, Paper,
  Table,
  TableBody,
  TableCell, TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import {Payment, PaymentStatus} from "../../types/payment";
import {SeverityPill, SeverityPillColor} from "../../components/severity-pill";
import {useCallback} from "react";
import {useAuth} from "../../hooks/use-auth";
import {useDocument} from "../../hooks/firebase/useDocument";
import {Group} from "../../types/group";

const statusMap: Record<PaymentStatus, SeverityPillColor> = {
  paid: 'success',
  upcoming: 'info',
  // canceled: 'warning',
  overdue: 'error'
};

interface PaymentsListTableProps {
  count?: number;
  items?: Payment[];
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (orderId: string) => void;
  page?: number;
  rowsPerPage?: number;
}

export const PaymentsListTable: FC<PaymentsListTableProps> = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelect,
    page = 0,
    rowsPerPage = 0
  } = props;

  const auth = useAuth();

  const getStatus = useCallback((payment: Payment) => {
    if(payment.userIdsPaid.includes(auth.user?.id as string)) {
      return 'paid';
    } else if (payment.dueOn < new Date().getTime()) {
      return 'overdue';
    } else {
        return 'upcoming';
    }
  }, [])

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Issued On
            </TableCell>
            <TableCell>
              Issued By
            </TableCell>
            <TableCell>
              Amount
            </TableCell>
            <TableCell>
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((payment) => {
            const createdAtMonth = format(payment.issuedOn, 'LLL').toUpperCase();
            const createdAtDay = format(payment.issuedOn, 'd');
            const totalAmount = numeral(payment
                .lineItems
                .reduce((total, lineItem) => total + lineItem.amount * lineItem.quantity, 0))
                .format(`$0,0.00`);
            const statusColor = statusMap[getStatus(payment)] || 'warning';

            return (
              <TableRow
                hover
                key={payment.id}
                onClick={() => onSelect?.(payment.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'neutral.800'
                        : 'neutral.200',
                      borderRadius: 2,
                      maxWidth: 'fit-content',
                      ml: 3,
                      px: 2,
                      py:1.5,
                    }}
                  >
                    <Typography
                      align="center"
                      variant="subtitle2"
                    >
                      {createdAtMonth}
                    </Typography>
                    <Typography
                      align="center"
                      variant="h6"
                    >
                      {createdAtDay}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1">
                      {payment.name}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Total of
                      {' '}
                      {totalAmount}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {format(payment.issuedOn, 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Paper
                      variant={'outlined'}
                      sx={{
                        alignContent: 'end',
                        justifyContent: 'end',
                        borderColor: 'lightgrey',
                        display: 'inline-block',
                        alignItems: 'end',
                        px: 1.15,
                        py: 0.25,
                      }}>
                    {payment.target.name}
                  </Paper>
                </TableCell>
                <TableCell>
                  {totalAmount}
                </TableCell>
                <TableCell align="right">
                  <SeverityPill color={statusColor}>
                    {getStatus(payment)}
                  </SeverityPill>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

PaymentsListTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelect: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number
};
