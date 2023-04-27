import { createSlice } from "@reduxjs/toolkit";
import {Status} from "../../utils/status";
import {Event} from "../../types/calendar";

const calendarEvents = createSlice({
    name: "eventsSlice",
    initialState: {
        data: [],
        status: Status.IDLE,
    },
    reducers: {
        setCalendarEvents: (state, action) => {

            const uniqueIds = new Set<string>();

            state.data = state.data.concat(action.payload).filter((event: Event) => {
                if (!uniqueIds.has(event.id)) {
                    uniqueIds.add(event.id);
                    return true;
                }
                return false;
            });
        },
        setCalendarEventsStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setCalendarEvents, setCalendarEventsStatus } = calendarEvents.actions;
export default calendarEvents.reducer;
