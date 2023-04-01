import { configureStore } from '@reduxjs/toolkit'
import mainFeedReducer from "../slices/posts/main-feed"
import calendarEventsReducer from "../slices/events/calendar-events"

export const store = configureStore({
    reducer: {
        mainFeed: mainFeedReducer,
        calendarEvents: calendarEventsReducer,
    },
})
