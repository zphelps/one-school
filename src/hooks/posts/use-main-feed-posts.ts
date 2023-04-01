import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "../../config";
import {setMainFeedPosts, setMainFeedPostsStatus} from "../../slices/posts/main-feed";
import {useAuth} from "../use-auth";
import {Status} from "../../utils/status";

const useMainFeedPosts = () => {
    const dispatch = useDispatch();
    // @ts-ignore
    const status = useSelector((state) => state.mainFeed.status);

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        const ref = query(collection(db, "tenants", auth.user.tenantID, "posts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(ref,
            (snapshot: { docs: any[]; }) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                dispatch(setMainFeedPosts(data));
                dispatch(setMainFeedPostsStatus(Status.SUCCESS));
            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
                dispatch(setMainFeedPostsStatus(Status.ERROR));
            }
        );

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return { status };
};

export default useMainFeedPosts;
