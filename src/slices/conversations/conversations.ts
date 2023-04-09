import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import {User} from "../../types/user";
import {Message, Thread} from "../../types/conversation";
import {objFromArray} from "../../utils/obj-from-array";
interface ConversationsState {
  users: {
    byId: Record<string, User>;
    allIds: string[];
  };
  currentThreadId?: string;
  threads: {
    byId: Record<string, Thread>;
    allIds: string[];
  };
  threadMessages: {
    byId: Record<string, Message[]>,
    allIds: string[],
  };
}

type GetUsersAction = PayloadAction<User[]>;

type GetThreadsAction = PayloadAction<Thread[]>;

type GetThreadAction = PayloadAction<Thread | null>;

type GetThreadMessagesAction = PayloadAction<{ threadID: string, messages: Message[] | null }>;

type MarkThreadAsSeenAction = PayloadAction<string>;

type SetCurrentThreadAction = PayloadAction<string | undefined>;

type AddMessageAction = PayloadAction<{ message: Message, threadId: string }>;

const initialState: ConversationsState = {
  users: {
    byId: {},
    allIds: []
  },
  currentThreadId: undefined,
  threads: {
    byId: {},
    allIds: []
  },
  threadMessages: {
    byId: {},
    allIds: [],
  }
};

const reducers = {
  getUsers(state: ConversationsState, action: GetUsersAction): void {
    const contacts = action.payload;

    state.users.byId = objFromArray(contacts);
    state.users.allIds = Object.keys(state.users.byId);
  },
  getThreads(state: ConversationsState, action: GetThreadsAction): void {
    const threads = action.payload;

    state.threads.byId = objFromArray(threads);
    state.threads.allIds = Object.keys(state.threads.byId);
  },
  getThread(state: ConversationsState, action: GetThreadAction): void {
    const thread = action.payload;


    if (thread) {
      state.threads.byId[thread.id!] = thread;

      if (!state.threads.allIds.includes(thread.id!)) {
        state.threads.allIds.unshift(thread.id!);
      }
    }
  },
  getThreadMessages(state: ConversationsState, action: GetThreadMessagesAction): void {
    const {messages, threadID} = action.payload;

    if (messages) {
      state.threadMessages.byId[threadID] = messages;

      if (!state.threadMessages.allIds.includes(threadID)) {
        state.threadMessages.allIds.unshift(threadID);
      }
    }
  },
  markThreadAsSeen(state: ConversationsState, action: MarkThreadAsSeenAction): void {
    const threadId = action.payload;
    const thread = state.threads.byId[threadId];

    if (thread) {
      thread.unreadCount = 0;
    }
  },
  setCurrentThread(state: ConversationsState, action: SetCurrentThreadAction): void {
    state.currentThreadId = action.payload;
  },
  addMessage(state: ConversationsState, action: AddMessageAction): void {
    const { threadId, message } = action.payload;
    const thread = state.threads.byId[threadId];
    const messages = state.threadMessages.byId[threadId];

    if (thread) {
      messages?.push(message);
      thread.lastMessage = message;
    }
  }
};

export const conversationsSlice = createSlice({
  name: 'conversationsSlice',
  initialState,
  reducers
});

export const { getThreads, getThread, getThreadMessages, setCurrentThread, markThreadAsSeen, addMessage } = conversationsSlice.actions;
export default conversationsSlice.reducer;
