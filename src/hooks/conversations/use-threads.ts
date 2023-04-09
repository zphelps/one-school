import {useEffect, useMemo} from "react";
import { useSelector, useDispatch } from "react-redux";
import {collection, onSnapshot, orderBy, query, where, FieldPath} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {getThreads} from "../../slices/conversations/conversations";

const useThreads = () => {
    const dispatch = useDispatch();

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        let ref = query(collection(db, "tenants", auth.user.tenantID, "threads"), where("participantIds", "array-contains", auth.user.id));

        const unsubscribe = onSnapshot(ref,
            (snapshot: { docs: any[]; }) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                dispatch(getThreads(data));
            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return { status };
};

export default useThreads;
