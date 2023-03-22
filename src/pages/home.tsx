import {Seo} from "../components/seo";
import {Grid, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useAuth} from "../hooks/use-auth";
import firebase from "firebase/compat";
import {query} from "firebase/firestore";
import {useCollection} from "../hooks/firebase/useCollection";
import {Post} from "../types/post";
import {PostCard} from "../components/feed/PostCard";
export const Home = () => {
    const [posts, setPosts] = useState([]);
    const auth = useAuth();
    const {documents, isPending, error} = useCollection(
        `users/${auth.user?.id}/posts`,
        [],
        [],
    );

    useEffect(() => {
        if (documents) {
            setPosts(documents);
        }
    }, [auth, documents])

    return (
        <>
            <Seo title="Dashboard: Social Feed"/>
            {isPending && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {posts && (
                posts.map((post: Post) => (
                    <PostCard key={post.id} post={post}/>
                ))
            )}
        </>
    )
}
