import {useEffect, useMemo} from "react";
import { useSelector, useDispatch } from "react-redux";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {Status} from "../../utils/status";
import {setCalendarEvents, setCalendarEventsStatus} from "../../slices/events/calendar-events";
import {Group} from "../../types/calendar";

const useCalendarEvents = (start?: number, end?: number) => {
    const dispatch = useDispatch();
    // @ts-ignore
    const status = useSelector((state) => state.calendarEvents.status);

    const auth = useAuth();

    useMemo(() => {
        // @ts-ignore
        let ref = collection(db, "tenants", auth.user.tenantID, "events");
        // @ts-ignore
        ref = query(ref, where("targetIDs", "array-contains-any", auth.user?.targetMembership));

        if (start && end) {
            // @ts-ignore
            ref = query(ref, where("start", ">=", start));
            // @ts-ignore
            ref = query(ref, where("start", "<=", end));
        }

        const unsubscribe = onSnapshot(ref,
            (snapshot: { docs: any[]; }) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                dispatch(setCalendarEvents(data));
                dispatch(setCalendarEventsStatus(Status.SUCCESS));
            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
                dispatch(setCalendarEventsStatus(Status.ERROR));
            }
        );

        return () => {
            unsubscribe();
        };
    }, [dispatch, start, end]);

    return { status };
};

export default useCalendarEvents;
