import 'react'
import {FC} from "react";
import {Avatar, Box, Button, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from "@mui/material";
import {PostComment} from "../../types/post-comment";
import {formatDistanceToNowStrict} from "date-fns";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {useCollection} from "../../hooks/firebase/useCollection";
import {useFirestore} from "../../hooks/firebase/useFirestore";
import {useAuth} from "../../hooks/use-auth";

interface PostCommentCardProps {
    comment: PostComment;
    postID: string;
    isTopComment?: boolean;
}

export const PostCommentCard: FC<PostCommentCardProps> = (props) => {
    const {comment, postID, isTopComment} = props;
    const {documents: likes, isPending, error} = useCollection(`posts/${postID}/comments/${comment.id}/likes`, [], []);
    const {addDocument: addLike, deleteDocument: removeLike, response: likeResponse} = useFirestore(
        `posts/${postID}/comments/${comment.id}/likes`
    );
    const {updateDocument: updateLikeCount, response: likeCountResponse} = useFirestore(`posts/${postID}/comments`);
    const {updateDocument: updateTopCommentLikeCount, response: updateTopCommentCountResponse} = useFirestore(`posts`);

    const auth = useAuth();

    const handleLike = async () => {
        // @ts-ignore
        if (likes && likes.some(like => like.id == auth.user?.id)) {
            await removeLike(auth.user?.id)
            await updateLikeCount(comment.id, {
                likeCount: comment.likeCount - 1
            });
            if(isTopComment){
                await updateTopCommentLikeCount(postID, {
                    ['topComment.likeCount']: comment.likeCount - 1
                })
            }
        } else {
            await addLike({
                id: auth.user?.id,
                firstName: auth.user?.firstName,
                lastName: auth.user?.lastName,
            })
            await updateLikeCount(comment.id, {
                likeCount: comment.likeCount + 1
            })
            if(isTopComment){
                await updateTopCommentLikeCount(postID, {
                    ['topComment.likeCount']: comment.likeCount + 1
                })
            }
        }
    }

    return (
        <Box sx={{px:1.5, pt: 1.5, pb: 0.5}}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'start'}>
                <Stack direction={'row'} spacing={1.5}>
                    <Avatar src={comment.author.imageURL} sx={{width: '36px', height: '36px'}}/>
                    <Stack>
                        <Typography variant={'body2'}>
                            {`${comment.author.firstName} ${comment.author.lastName}`}
                        </Typography>
                        <Typography variant={'caption'} color={'text.secondary'}>
                            {formatDistanceToNowStrict(new Date(comment.createdAt), {addSuffix: true})}
                        </Typography>
                        <Typography variant={'body2'} sx={{mt: 0.75}}>
                            {comment.body}
                        </Typography>
                    </Stack>
                </Stack>
                <Button
                    sx={{color: "red", fontSize: '13px'}}
                    onClick={handleLike}
                    disabled={likeResponse.isPending || likeCountResponse.isPending}
                >
                    {
                        // @ts-ignore
                        likes && likes.some(like => like.id == auth.user?.id)
                        ? <FavoriteIcon fontSize={"small"} sx={{p: 0.4}}/>
                        : <FavoriteBorderIcon fontSize={"small"} sx={{p: 0.3, mr: 0.9}}/>
                    }
                    {comment.likeCount === 0 ? " " : comment.likeCount}
                </Button>
            </Stack>

        </Box>
    )
}
