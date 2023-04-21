import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {Status} from "../../utils/status";
import {setAnnouncements, setAnnouncementsStatus} from "../../slices/announcements/announcements";

const useAnnouncements = () => {
    const dispatch = useDispatch();
    // @ts-ignore
    const status = useSelector((state) => state.announcements.status);

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        let ref = query(collection(db, "tenants", auth.user.tenantID, "users", auth.user?.id, "announcements"), orderBy("createdOn", "desc"));

        const unsubscribe = onSnapshot(ref,
            (snapshot: { docs: any[]; }) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                dispatch(setAnnouncements(data));
                dispatch(setAnnouncementsStatus(Status.SUCCESS));
            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
                dispatch(setAnnouncementsStatus(Status.ERROR));
            }
        );

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return { status };
};

export default useAnnouncements;
