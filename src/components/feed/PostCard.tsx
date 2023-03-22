import {Paper, Typography} from "@mui/material";
import type {Post} from "../../types/post";

// @ts-ignore
export const PostCard = ({post}) => {

    return (
        <Paper>
        <Typography>
            {post.id}
        </Typography>
    </Paper>
    )
}
