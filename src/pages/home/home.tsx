import {Seo} from "../../components/seo";
import {Post} from "../../types/post";
import {PostCard} from "../../components/feed/post-card";
import {useSelector} from "react-redux";
import useMainFeedPosts from "../../hooks/posts/use-main-feed-posts";
import {Status} from "../../utils/status";
import {Button, Container, Grid} from "@mui/material";
import {PostDialog} from "../../components/feed/create-post-dialog";
import {useDialog} from "../../hooks/use-dialog";
import {useCallback, useMemo} from "react";
import {MiniCalendar} from "../../sections/calendar/mini-calendar";
import {PostCardSkeleton} from "../../components/feed/post-skeleton-card";

export interface PreviewPostDialogData {
    postID?: string;
}

export const useCurrentPost = (
    posts: Post[],
    dialogData?: PreviewPostDialogData
): Post | undefined => {
    return useMemo(
        (): Post | undefined => {
            if (!dialogData) {
                return undefined;
            }

            return posts.find((post) => post.id === dialogData!.postID);
        },
        [dialogData, posts]
    );
};

export const Home = () => {
    // @ts-ignore
    const posts = useSelector((state) => state.mainFeed.data);
    // @ts-ignore
    const status = useSelector((state) => state.mainFeed.status);

    const createDialog = useDialog();

    const handleAddClick = useCallback(
        (): void => {
            createDialog.handleOpen();
        },
        [createDialog.handleOpen]
    );

    useMainFeedPosts();

    if (status === "error") {
        return <div>Error fetching data</div>;
    }

    return (
        <>
            <Seo title="Home | OneSchool"/>
            <Button onClick={handleAddClick}>New Post</Button>
            <Container maxWidth={'xl'}>
                <Grid container spacing={2}>
                    {status == Status.SUCCESS && <Grid item xs={12} sm={12} md={7} lg={7} xl={8}>
                        {posts && (
                            posts.map((post: Post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onMainFeed={true}
                                    preview={false}
                                    // handlePreviewClick={handlePreviewClick}
                                />
                            ))
                        )}
                    </Grid>}
                    {(status == Status.LOADING || status == Status.IDLE) && <Grid item xs={12} sm={12} md={7} lg={7} xl={8}>
                        {Array.from({length: 25}).map((_, i) => <PostCardSkeleton key={i}/>)}
                    </Grid>}
                    <Grid item xs={12} sm={12} md={5} lg={5} xl={4}>
                        <MiniCalendar />
                    </Grid>
                </Grid>
                <PostDialog
                    action="create"
                    onAddComplete={createDialog.handleClose}
                    onClose={createDialog.handleClose}
                    open={createDialog.open}
                />
            </Container>

        </>
    )
}
