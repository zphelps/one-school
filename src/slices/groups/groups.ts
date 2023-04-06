import { createSlice } from "@reduxjs/toolkit";
import {Status} from "../../utils/status";

const groupsSlice = createSlice({
    name: "groupsSlice",
    initialState: {
        data: {},
        status: Status.IDLE,
    },
    reducers: {
        setGroups: (state, action) => {
            state.data = action.payload;
        },
        setGroupsStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setGroups, setGroupsStatus } = groupsSlice.actions;
export default groupsSlice.reducer;
