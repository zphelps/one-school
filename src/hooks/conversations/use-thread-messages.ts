import {useEffect, useMemo, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {collection, onSnapshot, orderBy, query, where, doc} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {
    getThread,
    getThreadMessages,
    getThreads,
    markThreadAsSeen,
    setCurrentThread
} from "../../slices/conversations/conversations";
import {Thread} from "../../types/conversation";

const useThreadMessages = (threadId: string) => {
    const dispatch = useDispatch();

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        let messagesRef = query(collection(db, "tenants", auth.user.tenantID, "threads", threadId, 'messages'), orderBy('createdAt', 'asc'));

        const unsubscribeMessages = onSnapshot(messagesRef,
            (snapshot: { docs: any[]; }) => {
                const data = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                }));

                dispatch(getThreadMessages({threadID: threadId, messages: data}));
            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
            }
        );


        dispatch(setCurrentThread(threadId));
        dispatch(markThreadAsSeen(threadId))

        return () => {
            unsubscribeMessages();
        };
    }, [dispatch, threadId]);

    return {};
};

export default useThreadMessages;
