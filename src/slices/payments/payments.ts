import { createSlice } from "@reduxjs/toolkit";
import {Status} from "../../utils/status";

const paymentsSlice = createSlice({
    name: "paymentsSlice",
    initialState: {
        data: {},
        status: Status.IDLE,
    },
    reducers: {
        setPayments: (state, action) => {
            state.data = action.payload;
        },
        setPaymentsStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setPayments, setPaymentsStatus } = paymentsSlice.actions;
export default paymentsSlice.reducer;
