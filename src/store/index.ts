import { configureStore } from '@reduxjs/toolkit'
import mainFeedReducer from "../slices/posts/main-feed"
import groupFeedReducer from "../slices/posts/group-feed"
import announcementsReducer from "../slices/announcements/announcements"
import calendarEventsReducer from "../slices/events/calendar-events"
import groupEvents from "../slices/events/group-events"
import groupsReducer from "../slices/groups/groups"
import formsReducer from "../slices/forms/forms"
import groupMembersReducer from "../slices/members/group-members"
import conversationsReducer from "../slices/conversations/conversations"
import paymentsReducer from "../slices/payments/payments"

export const store = configureStore({
    reducer: {
        mainFeed: mainFeedReducer,
        groupFeed: groupFeedReducer,
        announcements: announcementsReducer,
        calendarEvents: calendarEventsReducer,
        groupEvents: groupEvents,
        groups: groupsReducer,
        forms: formsReducer,
        groupMembers: groupMembersReducer,
        conversations: conversationsReducer,
        payments: paymentsReducer,
    },
})
