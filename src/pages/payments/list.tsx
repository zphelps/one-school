import type {ChangeEvent, MouseEvent} from "react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {Box, Button, Divider, Stack, SvgIcon, Typography} from "@mui/material";
import {Payment} from "../../types/payment";
import {useMounted} from "../../hooks/use-mounted";
import {useDialog} from "../../hooks/use-dialog";
import {Seo} from "../../components/seo";
import {PaymentsListContainer} from "../../sections/payments/payments-list-container";
import {PaymentsListSearch} from "../../sections/payments/payments-list-search";
import {PaymentsListTable} from "../../sections/payments/payments-list-table";
import {PaymentDrawer} from "../../sections/payments/payment-drawer";
import useGroups from "../../hooks/groups/use-groups";
import {useSelector} from "react-redux";
import usePayments from "../../hooks/payments/use-payments";

interface Filters {
    query?: string;
    status?: string;
}

type SortDir = "asc" | "desc";

interface PaymentsSearchState {
    filters: Filters;
    page: number;
    rowsPerPage: number;
    sortBy?: string;
    sortDir?: SortDir;
}

const usePaymentsSearch = () => {
    const [state, setState] = useState<PaymentsSearchState>({
        filters: {
            query: undefined,
            status: undefined
        },
        page: 0,
        rowsPerPage: 5,
        sortBy: "createdAt",
        sortDir: "desc"
    });

    const handleFiltersChange = useCallback(
        (filters: Filters): void => {
            setState((prevState) => ({
                ...prevState,
                filters
            }));
        },
        []
    );

    const handleSortChange = useCallback(
        (sortDir: SortDir): void => {
            setState((prevState) => ({
                ...prevState,
                sortDir
            }));
        },
        []
    );

    const handlePageChange = useCallback(
        (event: MouseEvent<HTMLButtonElement> | null, page: number): void => {
            setState((prevState) => ({
                ...prevState,
                page
            }));
        },
        []
    );

    const handleRowsPerPageChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            setState((prevState) => ({
                ...prevState,
                rowsPerPage: parseInt(event.target.value, 10)
            }));
        },
        []
    );

    return {
        handleFiltersChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        state
    };
};

interface PaymentsStoreState {
    payments: Payment[];
    paymentsCount: number;
}

const useCurrentPayment = (payments: Payment[], paymentId?: string): Payment | undefined => {
    return useMemo(
        (): Payment | undefined => {
            if (!paymentId) {
                return undefined;
            }

            return payments.find((order) => order.id === paymentId);
        },
        [payments, paymentId]
    );
};

export const PaymentsList = () => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const paymentsSearch = usePaymentsSearch();
    const dialog = useDialog<string>();

    usePayments();

    const [paymentsStore, setPaymentsStore] = useState<PaymentsStoreState>({
        payments: [],
        paymentsCount: 0
    });
    const currentPayment = useCurrentPayment(paymentsStore.payments, dialog.data);

    // @ts-ignore
    const payments = useSelector((state) => state.payments.data);

    const isMounted = useMounted();

    useEffect(() => {
        if (payments.length > 0 && isMounted()) {
            setPaymentsStore({
                // @ts-ignore
                payments: payments.filter((payment) => {
                    if(paymentsSearch.state.filters.query) {
                        return payment.name.toLowerCase().includes(paymentsSearch.state.filters.query.toLowerCase());
                    }
                    return true;
                }),
                paymentsCount: payments.length
            });
        }
    }, [paymentsSearch.state, payments]);


    const handleOrderOpen = useCallback(
        (paymentId: string): void => {
            // Close drawer if is the same order

            if (dialog.open && dialog.data === paymentId) {
                dialog.handleClose();
                return;
            }

            dialog.handleOpen(paymentId);
        },
        [dialog]
    );

    return (
        <>
            <Seo title="Payments | OneSchool"/>
            <Divider/>
            <Box
                component="main"
                ref={rootRef}
                sx={{
                    display: "flex",
                    flex: "1 1 auto",
                    overflow: "hidden",
                    position: "relative"
                }}
            >
                <Box
                    ref={rootRef}
                    sx={{
                        bottom: 0,
                        display: "flex",
                        left: 0,
                        position: "absolute",
                        right: 0,
                        top: 0
                    }}
                >
                    <PaymentsListContainer open={dialog.open}>
                        <Box sx={{p: 3}}>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={4}
                            >
                                <div>
                                    <Typography variant="h4">
                                        Payments
                                    </Typography>
                                </div>
                                <div>
                                    <Button
                                        startIcon={(
                                            <SvgIcon>
                                                <PlusIcon/>
                                            </SvgIcon>
                                        )}
                                        variant="contained"
                                    >
                                        Payment Request
                                    </Button>
                                </div>
                            </Stack>
                        </Box>
                        <Divider/>
                        <PaymentsListSearch
                            onFiltersChange={paymentsSearch.handleFiltersChange}
                            onSortChange={paymentsSearch.handleSortChange}
                            sortBy={paymentsSearch.state.sortBy}
                            sortDir={paymentsSearch.state.sortDir}
                        />
                        <Divider/>
                        <PaymentsListTable
                            count={paymentsStore.paymentsCount}
                            items={paymentsStore.payments}
                            onPageChange={paymentsSearch.handlePageChange}
                            onRowsPerPageChange={paymentsSearch.handleRowsPerPageChange}
                            onSelect={handleOrderOpen}
                            page={paymentsSearch.state.page}
                            rowsPerPage={paymentsSearch.state.rowsPerPage}
                        />
                    </PaymentsListContainer>
                    <PaymentDrawer
                        container={rootRef.current}
                        onClose={dialog.handleClose}
                        open={dialog.open}
                        payment={currentPayment}
                    />
                </Box>
            </Box>
        </>
    );
};
