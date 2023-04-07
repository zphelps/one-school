import { createSlice } from "@reduxjs/toolkit";
import {Status} from "../../utils/status";
import {CalendarEvent} from "../../types/calendar";

const groupEvents = createSlice({
    name: "groupEventsSlice",
    initialState: {
        data: {},
        status: Status.IDLE,
    },
    reducers: {
        setGroupEvents: (state, action) => {

            if(action.payload.length === 0) return;
            const groupID = action.payload[0].group.id;

            const uniqueIds = new Set<string>();

            // @ts-ignore
            state.data = {
                ...state.data,
                // @ts-ignore
                [groupID]: (state.data[groupID] ?? []).concat(action.payload).filter((event: CalendarEvent) => {
                    if (!uniqueIds.has(event.id)) {
                        uniqueIds.add(event.id);
                        return true;
                    }
                    return false;
                })
            }
        },
        setGroupEventsStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setGroupEvents, setGroupEventsStatus } = groupEvents.actions;
export default groupEvents.reducer;
