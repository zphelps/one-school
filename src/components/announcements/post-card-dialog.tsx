import 'react'
import {FC} from "react";
import {Post} from "../../types/post";
import {Box, Dialog, Divider, IconButton, Stack, Typography} from "@mui/material";
import {PostCard} from "./post-card";
import CloseIcon from "@mui/icons-material/Close";

export interface PostCardDialogProps {
    post?: Post;
    onClose?: () => void;
    open?: boolean;
}

export const PostCardDialog: FC<PostCardDialogProps> = (props) => {
    const {post, onClose, open = false} = props;

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            onClose={onClose}
            open={open}
            sx={{
                p: 0,
                "& .MuiDialog-paper": {
                    margin: 0,
                    width: "100%",
                    overflowY: 'hidden',
                },
            }}
        >
            <Stack>
                <Box
                    sx={{width: "100%"}}
                    p={2}
                    justifyContent={"center"}
                    display={"flex"}
                    alignItems={"center"}
                >
                    <Typography
                        variant={"h6"}
                    >
                        {post?.group.name}'s Post
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            right: 10,
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Box>
                <Divider/>
                {post && <PostCard post={post} preview={true} onMainFeed={false}/>}
            </Stack>
        </Dialog>
    )
}
