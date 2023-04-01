import { createSlice } from "@reduxjs/toolkit";
import {Status} from "../../utils/status";

const calendarEvents = createSlice({
    name: "eventsSlice",
    initialState: {
        data: {},
        status: Status.IDLE,
    },
    reducers: {
        setCalendarEvents: (state, action) => {
            state.data = action.payload;
        },
        setCalendarEventsStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setCalendarEvents, setCalendarEventsStatus } = calendarEvents.actions;
export default calendarEvents.reducer;
