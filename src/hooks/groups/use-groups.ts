import {useEffect, useMemo} from "react";
import { useSelector, useDispatch } from "react-redux";
import {collection, onSnapshot, orderBy, query, where, FieldPath} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {Status} from "../../utils/status";
import {setGroups, setGroupsStatus} from "../../slices/groups/groups";

const useGroups = () => {
    const dispatch = useDispatch();
    // @ts-ignore
    const status = useSelector((state) => state.groups.status);

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        let ref = query(collection(db, "tenants", auth.user.tenantID, "groups"), orderBy("name", "asc"));

        const unsubscribe = onSnapshot(ref,
            (snapshot: { docs: any[]; }) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                dispatch(setGroups(data));
                dispatch(setGroupsStatus(Status.SUCCESS));
            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
                dispatch(setGroupsStatus(Status.ERROR));
            }
        );

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return { status };
};

export default useGroups;
