import {Seo} from "../../components/seo";
import {Post} from "../../types/post";
import {PostCard} from "../../components/feed/post-card";
import {useSelector} from "react-redux";
import useMainFeedPosts from "../../hooks/posts/use-main-feed-posts";
import {Status} from "../../utils/status";
import {Button, Container, Grid} from "@mui/material";
import {PostDialog} from "../../components/feed/create-post-dialog";
import {useDialog} from "../../hooks/use-dialog";
import {useCallback} from "react";
import {MiniCalendar} from "../../sections/calendar/mini-calendar";
import {CalendarEventPreviewDialog} from "../../sections/calendar/calendar-event-preview-dialog";
import {PreviewDialogData} from "../calendar/calendar";
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

    if (status === Status.IDLE || status === Status.LOADING) {
        return <div>Loading...</div>;
    }

    if (status === "error") {
        return <div>Error fetching data</div>;
    }

    return (
        <>
            <Seo title="Home | OneSchool"/>
            <Button onClick={handleAddClick}>New Post</Button>
            <Container maxWidth={'xl'}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={7} lg={7}>
                        {posts && (
                            posts.map((post: Post) => (
                                <PostCard key={post.id} post={post}/>
                            ))
                        )}
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} lg={4}>
                        <MiniCalendar/>
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
