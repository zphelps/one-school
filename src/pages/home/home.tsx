import {Seo} from "../../components/seo";
import {Post} from "../../types/post";
import {PostCard} from "../../components/feed/post-card";
import {useSelector} from "react-redux";
import useMainFeedPosts from "../../hooks/posts/use-main-feed-posts";
import {Status} from "../../utils/status";
import {
    Box,
    Button,
    Card,
    Container,
    Grid,
    InputAdornment, InputBase,
    OutlinedInput,
    Stack,
    SvgIcon,
    TextField
} from "@mui/material";
import {PostDialog} from "../../components/feed/create-post-dialog";
import {useDialog} from "../../hooks/use-dialog";
import {useCallback, useMemo} from "react";
import {MiniCalendar} from "../../sections/calendar/mini-calendar";
import {PostCardSkeleton} from "../../components/feed/post-skeleton-card";
import {UpcomingPaymentsCard} from "../../components/payments/upcoming-payments-card";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";

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
            {/*<Button onClick={handleAddClick}>New Post</Button>*/}
            <Container maxWidth={'xl'}>
                <Grid container spacing={2} sx={{mt: 2}}>
                    {status == Status.SUCCESS && <Grid item xs={12} sm={12} md={7} lg={7} xl={8}>
                        {posts && (
                            <>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    flexWrap="wrap"
                                    gap={3}
                                    sx={{pb: 3}}
                                >
                                    <Card
                                        component="form"
                                        // onSubmit={handleQueryChange}
                                        sx={{flexGrow: 1, p:2}}
                                    >
                                        <InputBase
                                            defaultValue=""
                                            fullWidth
                                            // inputProps={{ref: queryRef}}
                                            name="paymentNumber"
                                            placeholder="Search posts"
                                            startAdornment={(
                                                <InputAdornment position="start">
                                                    <SvgIcon>
                                                        <SearchMdIcon/>
                                                    </SvgIcon>
                                                </InputAdornment>
                                            )}
                                        />
                                    </Card>
                                    {/*<TextField*/}
                                    {/*    label="Sort By"*/}
                                    {/*    name="sort"*/}
                                    {/*    // onChange={handleSortChange}*/}
                                    {/*    select*/}
                                    {/*    SelectProps={{native: true}}*/}
                                    {/*    value={sortDir}*/}
                                    {/*>*/}
                                    {/*    {sortOptions.map((option) => (*/}
                                    {/*        <option*/}
                                    {/*            key={option.value}*/}
                                    {/*            value={option.value}*/}
                                    {/*        >*/}
                                    {/*            {option.label}*/}
                                    {/*        </option>*/}
                                    {/*    ))}*/}
                                    {/*</TextField>*/}
                                </Stack>
                                {posts.map((post: Post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onMainFeed={true}
                                    preview={false}
                                    // handlePreviewClick={handlePreviewClick}
                                />
                                ))}
                            </>
                        )}
                    </Grid>}
                    {(status == Status.LOADING || status == Status.IDLE) && <Grid item xs={12} sm={12} md={7} lg={7} xl={8}>
                        {Array.from({length: 25}).map((_, i) => <PostCardSkeleton key={i}/>)}
                    </Grid>}
                    <Grid item xs={12} sm={12} md={5} lg={5} xl={4}>
                        <Stack spacing={2}>
                            <MiniCalendar />
                            <UpcomingPaymentsCard />
                        </Stack>

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
