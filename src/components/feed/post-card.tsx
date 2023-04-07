import {Avatar, Button, Card, Paper, Stack, Typography} from "@mui/material";
import type {Post} from "../../types/post";
import {formatDistanceToNowStrict} from "date-fns";

// @ts-ignore
export const PostCard = ({post}) => {

    return (
        <Card sx={{mb: 2, mx: {xs: 1, md: 3}, px:1, py:3}} >
            <Stack direction="row" spacing={1.5} sx={{mx: 2}}>
                <Avatar src={post.author?.imageURL}></Avatar>
                <Stack>
                    <Typography component={"a"}>
                        {`${post.author?.firstName ?? ''} ${post.author?.lastName ?? ''}`}
                    </Typography>
                    <Typography variant={"caption"} color={"text.secondary"}>
                        {formatDistanceToNowStrict(new Date(post.createdAt), {addSuffix: true})}
                    </Typography>
                </Stack>
            </Stack>
            <Typography variant={"body1"} sx={{my: 1, mx: 2}}>
                {`${post.text ?? ''}`}
            </Typography>
            {/*TODO: Add support for multiple images*/}
            {post.imageURLS?.length > 0 && <img style={{objectFit: "cover", minWidth: "100%", maxHeight: "30vh"}} src={post.imageURLS[0]}></img>}

            <Stack direction={"row"} justifyContent={"space-around"} sx={{mt: 1}}>
                <Button sx={{color: "red"}}>
                    Like
                </Button>
                <Button sx={{color: "blue"}}>
                    Comment
                </Button>
                <Button sx={{color: "purple"}}>
                    Share
                </Button>
            </Stack>

        </Card>
    )
}
