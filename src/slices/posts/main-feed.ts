import { createSlice } from "@reduxjs/toolkit";
import {Status} from "../../utils/status";

const mainFeedSlice = createSlice({
    name: "mainFeedSlice",
    initialState: {
        data: {},
        status: Status.IDLE,
    },
    reducers: {
        setMainFeedPosts: (state, action) => {
            state.data = action.payload;
        },
        setMainFeedPostsStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setMainFeedPosts, setMainFeedPostsStatus } = mainFeedSlice.actions;
export default mainFeedSlice.reducer;
