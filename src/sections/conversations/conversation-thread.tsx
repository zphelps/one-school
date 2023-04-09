import type {FC, MutableRefObject} from "react";
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import type SimpleBarCore from "simplebar-core";
import {Box, Divider, Stack} from "@mui/material";
import {Participant, Thread} from "../../types/conversation";
import {useRouter} from "../../hooks/use-router";
import {paths} from "../../paths";
import {useAuth} from "../../hooks/use-auth";
import {Scrollbar} from "../../components/scrollbar";
import {ConversationMessageAdd} from "./conversation-message-add";
import {ConversationThreadToolbar} from "./conversation-thread-toolbar";
import {ConversationMessages} from "./conversation-messages";
import useThread from "../../hooks/conversations/use-thread";
import {useDispatch, useSelector} from "react-redux";
import {addMessage, setCurrentThread} from "../../slices/conversations/conversations";
import {httpsCallable} from "firebase/functions";
import {functions} from "../../config";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

interface ConversationThreadProps {
    threadKey: string;
}

export const ConversationThread: FC<ConversationThreadProps> = (props) => {
    const {threadKey, ...other} = props;
    const user = useAuth().user;
    const dispatch = useDispatch();

    const thread = useSelector((state) => {
        // @ts-ignore
        const {threads, currentThreadId} = state.conversations;

        return threads.byId[currentThreadId as string];
    });

    useThread(threadKey);

    const handleSend = useCallback(
        async (body: string): Promise<void> => {
            // If we have the thread, we use its ID to add a new message

            if (thread) {
                try {
                    const message = {
                        id: uuidv4(),
                        attachments: [],
                        body,
                        createdAt: new Date().getTime(),
                        contentType: 'text',
                        authorId: user!.id,
                        sent: false,
                    }
                    await dispatch(addMessage({
                        threadId: thread.id,
                        message
                    }));
                    const sendMessage = httpsCallable(functions, "sendMessage");
                    await sendMessage({message: message, threadId: thread.id, tenantID: user?.tenantID});
                } catch (err) {
                    console.error(err);
                }

                return;
            }
        },
        [dispatch, thread, user]
    );

    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // @ts-ignore
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [thread]);

    // Maybe implement a loading state

    return (
        <Stack
            sx={{
                flexGrow: 1,
                overflow: "hidden"
            }}
            {...other}
        >
            {thread?.participants && <ConversationThreadToolbar participants={thread.participants}/>}
            <Divider/>
            <Box
                ref={containerRef}
                sx={{
                    flexGrow: 1,
                    overflow: "hidden",
                    overflowY: "auto"
                }}
            >
                <ConversationMessages
                    messages={thread?.messages || []}
                    participants={thread?.participants || []}
                />
            </Box>
            <Divider/>
            <ConversationMessageAdd onSend={handleSend}/>
        </Stack>
    );
};

ConversationThread.propTypes = {
    threadKey: PropTypes.string.isRequired
};
