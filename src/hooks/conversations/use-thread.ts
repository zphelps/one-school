import {useEffect, useMemo, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {collection, onSnapshot, orderBy, query, where, doc} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {getThread, getThreads, markThreadAsSeen, setCurrentThread} from "../../slices/conversations/conversations";
import {Thread} from "../../types/conversation";

const useThread = (threadId: string) => {
    const dispatch = useDispatch();

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        let threadRef = doc(db, "tenants", auth.user.tenantID, "threads", threadId);
        // @ts-ignore
        let messagesRef = query(collection(db, "tenants", auth.user.tenantID, "threads", threadId, 'messages'), orderBy('createdAt', 'asc'));

        const unsubscribeThread = onSnapshot(threadRef,
            (doc) => {
                if (!doc.exists()) return;

                const thread = {
                    ...doc.data(),
                }

                dispatch(getThread(thread as Thread));

            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
            }
        );


        dispatch(setCurrentThread(threadId));
        dispatch(markThreadAsSeen(threadId))

        return () => {
            unsubscribeThread();
        };
    }, [dispatch, threadId]);

    return {};
};

export default useThread;
