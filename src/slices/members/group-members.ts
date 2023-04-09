import { createSlice } from "@reduxjs/toolkit";
import {Status} from "../../utils/status";

const groupMembersSlice = createSlice({
    name: "groupMembersSlice",
    initialState: {
        data: {},
        status: Status.IDLE,
    },
    reducers: {
        setGroupMembers: (state, action) => {
            if(action.payload.length === 0) return;
            const groupID = action.payload[0].groupID;
            state.data = {
                ...state.data,
                [groupID]: action.payload,
            };
        },
        setGroupMembersStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setGroupMembers, setGroupMembersStatus } = groupMembersSlice.actions;
export default groupMembersSlice.reducer;
