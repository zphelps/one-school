import 'react'
import {FC} from "react";
import {useSelector} from "react-redux";
import useMainFeedPosts from "../../hooks/posts/use-main-feed-posts";
import {Status} from "../../utils/status";
import {Post} from "../../types/post";
import {PostCard} from "../../components/feed/post-card";
import useGroupFeedPosts from "../../hooks/posts/use-group-feed-posts";

interface GroupPostsListProps {
    groupId: string
}
export const GroupPostsList: FC<GroupPostsListProps> = (props) => {
    const {groupId} = props;
    // @ts-ignore
    const posts = useSelector((state) => state.groupFeed.data);
    // @ts-ignore
    const status = useSelector((state) => state.groupFeed.status);

    useGroupFeedPosts(groupId);

    if (status === Status.IDLE || status === Status.LOADING || !posts[groupId]) {
        return <div>Loading...</div>;
    }

    if (status === "error") {
        return <div>Error fetching data</div>;
    }

    return (
        <>
            {posts[groupId] && (
                posts[groupId].map((post: Post) => (
                    <PostCard key={post.id} post={post}/>
                ))
            )}
        </>
    )
}
