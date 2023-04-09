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

            // @ts-ignore
            const groupEvents = state.data[groupID] as CalendarEvent[];

            if(!groupEvents) {
                state.data = {
                    ...state.data,
                    [groupID]: action.payload
                }
            } else {
                // Create a hashmap of the updated events, using the event IDs as keys
                const updatedEventsMap = new Map(action.payload.map((event: CalendarEvent) => [event.id, event]));

                // Iterate through the old array of events
                for (let i = 0; i < groupEvents.length; i++) {
                    // Check if there's an updated version in the hashmap
                    const updatedEvent = updatedEventsMap.get(groupEvents[i].id);

                    // If there's an updated version, replace the old event with the updated one
                    if (updatedEvent) {
                        groupEvents[i] = updatedEvent as CalendarEvent;
                    }

                }
            }
        },
        setGroupEventsStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const { setGroupEvents, setGroupEventsStatus } = groupEvents.actions;
export default groupEvents.reducer;
