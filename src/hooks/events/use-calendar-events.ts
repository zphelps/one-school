import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {Status} from "../../utils/status";
import {setCalendarEvents, setCalendarEventsStatus} from "../../slices/events/calendar-events";

const useCalendarEvents = () => {
    const dispatch = useDispatch();
    // @ts-ignore
    const status = useSelector((state) => state.calendarEvents.status);

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        const ref = collection(db, "tenants", auth.user.tenantID, "events");

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
    }, [dispatch]);

    return { status };
};

export default useCalendarEvents;
