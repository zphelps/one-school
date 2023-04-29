import 'react'
import {Button, Card, Chip, ListItem, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import usePayments from "../../hooks/payments/use-payments";
import {useSelector} from "react-redux";
import {useEffect, useMemo, useState} from "react";
import {Payment} from "../../types/payment";
import {useAuth} from "../../hooks/use-auth";
import {format} from "date-fns";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {useNavigate} from "react-router-dom";
export const UpcomingPaymentsCard = () => {
    const [payments, setPayments] = useState([]);
    const auth = useAuth();
    const navigate = useNavigate();

    // @ts-ignore
    const paymentsSelector = useSelector((state) => state.payments.data);

    usePayments();

    useMemo(() => {
        if(paymentsSelector.length > 0) {
            setPayments(paymentsSelector.filter((payment: Payment) => {
                return payment.dueOn <= new Date().getTime()
                    && !payment.userIdsPaid.includes(auth.user?.id as string);
            }));
        }
    }, [paymentsSelector]);

    return (
        <Card
            sx={{
                p: 2,
                maxWidth: 375,
            }}
        >
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant={"h6"} sx={{px: 1, pt: 0.5}}>Payments</Typography>
                <Button
                    size={"small"}
                    sx={{mr: 1.25}}
                    onClick={() => navigate("/payments")}
                >
                    View All
                </Button>
            </Stack>
            {payments.map((payment: Payment) => {
                const totalAmount = payment.lineItems.reduce((total: number, lineItem: any) => {
                    return total + lineItem.amount;
                }, 0);
                return (
                    <ListItem
                        key={payment.id}
                        sx={{
                            p: 1,
                            '&:hover': {
                                backgroundColor: 'action.hover',
                                cursor: 'pointer',
                                borderRadius: 2,
                            },
                        }}
                    >
                        <ListItemText
                            primary={payment.name}
                            secondary={`Due on ${format(payment.dueOn, 'MMM d, yyyy')}`}
                        />
                        <Chip
                            variant={"outlined"}
                            sx={{
                                borderRadius: '8px',
                            }}
                            label={`$${totalAmount}`}
                        />
                        {/*<ChevronRightIcon sx={{*/}
                        {/*    color: 'text.secondary'*/}
                        {/*}}/>*/}
                    </ListItem>
                )
            })}
        </Card>
    )
}
