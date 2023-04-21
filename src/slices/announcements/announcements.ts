import { createSlice } from "@reduxjs/toolkit";
import {Status} from "../../utils/status";

const announcementsSlice = createSlice({
    name: "announcementsSlice",
    initialState: {
        data: {},
        status: Status.IDLE,
    },
    reducers: {
        setAnnouncements: (state, action) => {
            state.data = action.payload;
        },
        setAnnouncementsStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setAnnouncements, setAnnouncementsStatus } = announcementsSlice.actions;
export default announcementsSlice.reducer;
