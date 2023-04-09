import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {Status} from "../../utils/status";
import {setGroupMembers, setGroupMembersStatus} from "../../slices/members/group-members";

const useGroupMembers = (groupID: string) => {
    const dispatch = useDispatch();
    // @ts-ignore
    const status = useSelector((state) => state.groupFeed.status);

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        let ref = query(collection(db, "tenants", auth.user.tenantID, "groups", groupID, "members"), orderBy("firstName", "desc"));

        const unsubscribe = onSnapshot(ref,
            (snapshot: { docs: any[]; }) => {
                const data = snapshot.docs.map((doc) => ({
                    groupID: groupID,
                    id: doc.id,
                    ...doc.data(),
                }));
                dispatch(setGroupMembers(data));
                dispatch(setGroupMembersStatus(Status.SUCCESS));
            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
                dispatch(setGroupMembersStatus(Status.ERROR));
            }
        );

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return { status };
};

export default useGroupMembers;
