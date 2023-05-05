import { createSlice } from "@reduxjs/toolkit";
import {Status} from "../../utils/status";

const formsSlice = createSlice({
    name: "formsSlice",
    initialState: {
        data: {},
        status: Status.IDLE,
    },
    reducers: {
        setForms: (state, action) => {
            state.data = action.payload;
        },
        setFormsStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setForms, setFormsStatus } = formsSlice.actions;
export default formsSlice.reducer;
