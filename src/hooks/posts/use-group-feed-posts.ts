import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {Status} from "../../utils/status";
import {setGroupFeedPosts, setGroupFeedPostsStatus} from "../../slices/posts/group-feed";

const useGroupFeedPosts = (groupID: string) => {
    const dispatch = useDispatch();
    // @ts-ignore
    const status = useSelector((state) => state.groupFeed.status);

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        let ref = query(collection(db, "tenants", auth.user.tenantID, "groups", groupID, "posts"), orderBy("createdAt", "desc"));

        if (!auth.user?.targetMembership.includes(groupID)) {
            ref = query(ref, where("public", "==", true));
        }

        const unsubscribe = onSnapshot(ref,
            (snapshot: { docs: any[]; }) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                dispatch(setGroupFeedPosts(data));
                dispatch(setGroupFeedPostsStatus(Status.SUCCESS));
            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
                dispatch(setGroupFeedPostsStatus(Status.ERROR));
            }
        );

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return { status };
};

export default useGroupFeedPosts;
