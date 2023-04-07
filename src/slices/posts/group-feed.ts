import { createSlice } from "@reduxjs/toolkit";
import {Status} from "../../utils/status";

const groupFeedSlice = createSlice({
    name: "groupFeedSlice",
    initialState: {
        data: {},
        status: Status.IDLE,
    },
    reducers: {
        setGroupFeedPosts: (state, action) => {
            if(action.payload.length === 0) return;
            const groupID = action.payload[0].group.id;
            state.data = {
                ...state.data,
                [groupID]: action.payload,
            };
        },
        setGroupFeedPostsStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setGroupFeedPosts, setGroupFeedPostsStatus } = groupFeedSlice.actions;
export default groupFeedSlice.reducer;
