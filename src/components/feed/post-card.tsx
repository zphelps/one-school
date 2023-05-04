import {Avatar, Box, Button, Card, Divider, IconButton, InputAdornment, OutlinedInput, Paper, Stack, Typography} from "@mui/material";
import type {Post} from "../../types/post";
import {formatDistanceToNowStrict} from "date-fns";
import ImageCarousel from "../image-carousel";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import {useCollection} from "../../hooks/firebase/useCollection";
import {useFirestore} from "../../hooks/firebase/useFirestore";
import {useAuth} from "../../hooks/use-auth";
import {PostComment} from "../../types/post-comment";
import {PostCommentCard} from "./post-comment-card";
import {FC, useCallback, useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {alpha} from "@mui/material/styles";
import {LeafPoll, Result} from "react-leaf-polls";
import PollComponent from "./poll";
import {Link} from "react-router-dom";
import {PollOption} from "../../types/poll";
import {useDialog} from "../../hooks/use-dialog";
import {PreviewPostDialogData} from "../../pages/home/home";
import {PostCardDialog} from "./post-card-dialog";
import {cacheImages} from "../../utils/cache-image";
import {MoreHorizOutlined, MoreVertOutlined} from "@mui/icons-material";
import {ManagePostButton} from "./manage-post-button";

interface PostCardProps {
    post: Post;
    onMainFeed?: boolean;
    preview?: boolean;
}
// @ts-ignore
export const PostCard: FC<PostCardProps> = (props) => {
    const {post, onMainFeed = false, preview = false} = props;
    const {documents: likes, isPending, error} = useCollection(`posts/${post.id}/likes`, [], []);
    const {addDocument: addLike, deleteDocument: removeLike, response: likeResponse} = useFirestore(`posts/${post.id}/likes`);
    const {updateDocument: updatePost, response: updatePostResponse} = useFirestore(`posts`);
    const {documents: comments, isPending: isPendingComments, error: errorComments} = useCollection(`posts/${post.id}/comments`, [], ['createdAt', 'desc']);
    const auth = useAuth();

    const [comment, setComment] = useState<string>('');
    const {addDocument: addComment, response: commentResponse} = useFirestore(`posts/${post.id}/comments`);
    const [commentFieldDisabled, setCommentFieldDisabled] = useState<boolean>(false);

    const previewDialog = useDialog<PreviewPostDialogData>();

    const handlePreviewClick = useCallback(
        (postID: string): void => {
            previewDialog.handleOpen({
                postID: postID
            });
        },
        [previewDialog.handleOpen]
    );

    const handleLike = async () => {
        // @ts-ignore
        if (likes && likes.some(like => like.id == auth.user?.id)) {
            await removeLike(auth.user?.id)
            await updatePost(post.id, {
                likeCount: post.likeCount - 1
            });
        } else {
            await addLike({
                id: auth.user?.id,
                firstName: auth.user?.firstName,
                lastName: auth.user?.lastName,
            })
            await updatePost(post.id, {
                likeCount: post.likeCount + 1
            })
        }
    }

    const handleCommentChange = (e: any) => {
        setComment(e.target.value);
    }

    const handleCommentSubmit = async () => {
        setCommentFieldDisabled(true);
        await addComment({
            id: uuidv4(),
            firstName: auth.user?.firstName,
            lastName: auth.user?.lastName,
            body: comment,
            createdAt: new Date().getTime(),
            likeCount: 0,
            author: {
                id: auth.user?.id,
                firstName: auth.user?.firstName,
                lastName: auth.user?.lastName,
                imageURL: auth.user?.imageURL,
            }
        })
        await updatePost(post.id, {
            commentCount: (post.commentCount ?? 0) + 1
        })
        setComment('');
        setCommentFieldDisabled(false);
    }

    const handleVote = async (vote: PollOption) => {
        console.log(vote)
        try {
            await updatePost(post.id, {
                poll: {
                    ...post.poll,
                    options: post.poll!.options.map((option: PollOption) => {
                        if(option.id != vote.id) return option;
                        return {
                            ...option,
                            voterIDs: [...option.voterIDs, auth.user?.id],
                        }
                    }),
                    votes: post.poll!.votes + 1,
                }
            })
            console.log("success")
            console.log(updatePostResponse)
        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {
        if(post.imageURLS) {
            cacheImages(post.imageURLS)
        }
    }, [post.imageURLS])

    return (
        <Card sx={{
            mb: preview ? 0 : 2,
            px:1,
            pt:3,
            pb: preview ? '200px' : 1,
            maxHeight: preview ? '90vh' : 'inherit',
            overflowY: preview ? 'scroll' : 'inherit',
            boxShadow: preview ? 'none' : 'inherit',
            borderRadius: preview ? '0px' : null,
            backgroundColor: preview ? 'transparent' : 'inherit',
        }}
        >
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'start'}>
                <Stack direction="row" spacing={1.5} sx={{mx: 2}}>
                    <Avatar src={onMainFeed ? post.group.imageURL : post.author.imageURL}></Avatar>
                    <Stack>
                        {onMainFeed && <Link to={`/groups/${post.group.id}`} style={{textDecoration: "none", color: "black"}}>
                            <Typography>
                                {post.group.name}
                            </Typography>
                        </Link>}
                        {!onMainFeed && <Link to={`/users/${post.author.id}`} style={{textDecoration: "none", color: "black"}}>
                            <Typography>
                                {`${post.author?.firstName ?? ""} ${post.author?.lastName ?? ""}`}
                            </Typography>
                        </Link>}
                        <Typography variant={"caption"} color={"text.secondary"}>
                            {onMainFeed && `Posted by ${post.author?.firstName} ${post.author?.lastName} • `}
                            {formatDistanceToNowStrict(new Date(post.createdAt), {addSuffix: true})}
                        </Typography>
                    </Stack>
                </Stack>
                <ManagePostButton post={post} />
            </Stack>
            <Typography variant={"body1"} sx={{my: 1, mx: 2}}>
                {`${post.text ?? ''}`}
            </Typography>

            {post.poll && <PollComponent post={post} handleVote={handleVote}/>}

            {post.imageURLS?.length > 1 && (
                <ImageCarousel images={post.imageURLS} />
            )}
            {post.imageURLS?.length == 1 && (
                <Box
                    height={'400px'}
                    sx={{px:1.5}}
                >
                    <img
                        style={{objectFit: "cover", width: "100%", height: '400px', maxHeight: "400px", borderRadius: '10px'}}
                        src={post.imageURLS[0]}/>

                </Box>
            )}

            <Stack
                direction={"row"}
                justifyContent={"space-around"}
                sx={{my:1.5, mx:1.5}}
                spacing={1}
            >
                <Button
                    size={'small'}
                    variant={"contained"}
                    disableElevation={true}
                    sx={{
                        color: "red",
                        width: '100%',
                        backgroundColor: (_) => alpha("#F44336", 0.05),
                        boxShadow: 'none',
                        borderRadius: '8px',
                        '&:hover': {
                            opacity: 1,
                            backgroundColor: (_) => alpha("#F44336", 0.1),
                        },
                    }}
                    onClick={handleLike}
                    disabled={likeResponse.isPending || updatePostResponse.isPending}
                >
                    {
                        // @ts-ignore
                        (likes && likes.some(like => like.id == auth.user?.id)) &&
                        <FavoriteIcon fontSize={"small"} sx={{mr: 1}}/>
                    }
                    {
                        // @ts-ignore
                        (likes && !likes.some(like => like.id == auth.user?.id)) &&
                        <FavoriteBorderIcon fontSize={"small"} sx={{mr: 1}}/>
                    }
                    {post.likeCount === 0 ? 'Like' : post.likeCount}
                </Button>
                <Button
                    disableElevation={true}
                    disableRipple={preview}
                    sx={{
                        color: 'dodgerblue',
                        width: '100%',
                        backgroundColor: (_) => alpha("#03A9F4", 0.07),
                        boxShadow: 'none',
                        borderRadius: '8px',
                        '&:hover': {
                            opacity: 1,
                            backgroundColor: (_) => alpha("#03A9F4", 0.1),
                        },
                    }}
                    size={'small'}
                    onClick={() => !preview && handlePreviewClick(post.id)}
                >
                    <CommentIcon fontSize={'small'} sx={{mr: 1}}/>
                    {post.commentCount === 0 ? 'Comment' : post.commentCount}
                </Button>
                <Button
                    disableElevation={true}
                    sx={{
                        color: 'rebeccaPurple',
                        width: '100%',
                        backgroundColor: (_) => alpha("#673AB7", 0.05),
                        boxShadow: 'none',
                        borderRadius: '8px',
                        '&:hover': {
                            opacity: 1,
                            backgroundColor: (_) => alpha("#673AB7", 0.1),
                        },
                    }}
                    size={'small'}
                >
                    <ShareIcon fontSize={'small'} sx={{mr: 1}}/>
                    Share
                </Button>
            </Stack>

            {(post.topComment || (comments && preview)) && <Divider sx={{mt: 1.5, mb: 0.5}}/>}

            {post.topComment && !preview && <Box sx={{pb: 1}}>
                <PostCommentCard
                    key={post.topComment.id}
                    comment={post.topComment}
                    postID={post.id}
                    isTopComment={true}
                />
            </Box>}

            {comments && preview && (comments as PostComment[]).map((c: PostComment) => (
                <PostCommentCard
                    key={c.id}
                    comment={c}
                    postID={post.id}
                    isTopComment={c.id === post.topComment?.id}
                />
            ))}

            {!preview
                && post.topComment
                && post.commentCount! > 1
                && <Box justifyContent={'center'} width={'100%'} display={'flex'}>
                <Button size={"small"} onClick={() => handlePreviewClick(post.id)}>
                    View all {post.commentCount} comments
                </Button>
            </Box>}

            {preview && <Stack
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    px: 1.5,
                    pt: 1.5,
                    pb: 2,
                    borderRadius: "20px 20px 10px 10px",
                    boxShadow: "0px -2px 4px -1px rgba(0,0,0,0.075)",
                }}
                direction={"row"}
                spacing={1}
            >
                <Avatar
                    sx={{
                        display: {
                            xs: "none",
                            sm: "inline"
                        },
                        width: "36px",
                        height: "36px",
                    }}
                    src={auth.user?.imageURL}
                />
                <OutlinedInput
                    disabled={commentFieldDisabled}
                    fullWidth
                    onChange={handleCommentChange}
                    onSubmit={handleCommentSubmit}
                    placeholder="Leave a comment"
                    size="small"
                    value={comment}
                    endAdornment={
                        <InputAdornment position="end">
                            {comment.length > 2 && <IconButton
                                onClick={handleCommentSubmit}
                            >
                                <Typography
                                    variant={"subtitle2"}
                                    color={"primary"}
                                >
                                    Post
                                </Typography>
                            </IconButton>}
                        </InputAdornment>
                    }
                />
            </Stack>}
            <PostCardDialog
                onClose={previewDialog.handleClose}
                open={previewDialog.open}
                post={post}
            />
        </Card>
    )
}
