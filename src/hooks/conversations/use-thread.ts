import {useEffect, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {collection, onSnapshot, orderBy, query, where, doc} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {getThread, markThreadAsSeen, setCurrentThread} from "../../slices/conversations/conversations";
import {Thread} from "../../types/conversation";

const useThread = (threadId: string) => {
    const dispatch = useDispatch();

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        let ref = doc(db, "tenants", auth.user.tenantID, "threads", threadId);

        const unsubscribe = onSnapshot(ref,
            (doc) => {
                if (!doc.exists()) return;
                dispatch(getThread(doc.data() as Thread));
                dispatch(setCurrentThread(threadId));
                dispatch(markThreadAsSeen(threadId))
            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return {};
};

export default useThread;
