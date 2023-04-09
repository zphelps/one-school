import { configureStore } from '@reduxjs/toolkit'
import mainFeedReducer from "../slices/posts/main-feed"
import groupFeedReducer from "../slices/posts/group-feed"
import calendarEventsReducer from "../slices/events/calendar-events"
import groupEvents from "../slices/events/group-events"
import groupsReducer from "../slices/groups/groups"
import groupMembersReducer from "../slices/members/group-members"
import conversationsReducer from "../slices/conversations/conversations"

export const store = configureStore({
    reducer: {
        mainFeed: mainFeedReducer,
        groupFeed: groupFeedReducer,
        calendarEvents: calendarEventsReducer,
        groupEvents: groupEvents,
        groups: groupsReducer,
        groupMembers: groupMembersReducer,
        conversations: conversationsReducer,
    },
})
