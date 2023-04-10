import {FC, SetStateAction, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {formatDistanceToNowStrict} from "date-fns";
import {Avatar, Box, Card, CardMedia, Divider, Link, Paper, Stack, Typography} from "@mui/material";
import {getLinkPreview} from "link-preview-js";


interface ConversationMessageProps {
    authorAvatar?: string | null;
    authorName: string;
    body: string;
    contentType: string;
    createdAt: number;
    position?: "left" | "right";
    sent: boolean;
}

const extractLinks = (text: string) => {
    const regex = /((https?:\/\/|www\.)([^\s]+))/g;
    const links = text.match(regex);
    return links || [];
};

const fetchLinkPreviews = async (links: string[], setLinkPreviews: unknown) => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";

    const previews = await Promise.all(
        links.map(async (link) => {
            try {
                const preview = await getLinkPreview(link, {
                    headers: {
                        "x-requested-with": "love", // Needed for cors-anywhere
                    },
                    proxyUrl,
                });
                return preview;
            } catch (error) {
                console.error("Error fetching link preview:", error);
                return null;
            }
        })
    );
    // @ts-ignore
    setLinkPreviews(previews.filter((preview) => preview !== null));
};

export const ConversationMessage: FC<ConversationMessageProps> = (props) => {
    const {authorAvatar, authorName, body, contentType, createdAt, position, sent, ...other} = props;

    const ago = formatDistanceToNowStrict(createdAt);

    const [linkPreviews, setLinkPreviews] = useState([]);

    useEffect(() => {
        const links = extractLinks(body);
        if (links.length > 0) {
            fetchLinkPreviews(links, setLinkPreviews);
        }
    }, [body]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: position === "right" ? "flex-end" : "flex-start"
            }}
            {...other}
        >
            <Stack
                alignItems="flex-start"
                direction={position === "right" ? "row-reverse" : "row"}
                spacing={2}
                sx={{
                    maxWidth: 500,
                    ml: position === "right" ? "auto" : 0,
                    mr: position === "left" ? "auto" : 0
                }}
            >
                <Avatar
                    src={authorAvatar || undefined}
                    sx={{
                        height: 32,
                        width: 32
                    }}
                />
                <Box sx={{flexGrow: 1}}>
                    <Card
                        sx={{
                            backgroundColor: position === "right" ? "primary.main" : "background.paper",
                            color: position === "right" ? "primary.contrastText" : "text.primary",
                            px: 2,
                            py: 1
                        }}
                    >
                        <Box sx={{mb: 1}}>
                            <Link
                                color="inherit"
                                sx={{cursor: "pointer"}}
                                variant="subtitle2"
                            >
                                {authorName}
                            </Link>
                        </Box>
                        {contentType === "image" && (
                            <CardMedia
                                onClick={(): void => {
                                }}
                                image={body}
                                sx={{
                                    height: 200,
                                    width: 200
                                }}
                            />
                        )}
                        {contentType === "text" && (
                            <Typography
                                color="inherit"
                                variant="body1"
                            >
                                {body}
                            </Typography>
                        )}
                        {linkPreviews && linkPreviews.map((preview: any, index) => (
                            <a key={index} href={preview.url} style={{textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">
                                {preview.images ? <Paper
                                    variant={"outlined"}
                                    sx={{
                                        backgroundColor: "white",
                                        // width: "200px",
                                        margin: "0px",
                                        borderRadius: "10px",
                                        p: 2,
                                        my: 1
                                    }}
                                >
                                    <img
                                        style={{
                                            backgroundColor: "white",
                                            width: "100%",
                                            maxWidth: "250px",
                                            margin: "0 auto",
                                        }}
                                        src={preview.images[0]}
                                        alt={preview.title}
                                    />
                                    <Divider sx={{m: 1}}/>
                                    <Typography
                                        variant={"subtitle1"}
                                        color={"text.primary"}
                                    >
                                        {preview.title}
                                    </Typography>
                                    <Typography
                                        variant={"body2"}
                                        color={"text.secondary"}
                                    >
                                        {preview.description}
                                    </Typography>
                                </Paper> : <Typography>{preview.url}</Typography>}
                            </a>
                        ))}
                    </Card>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: position === "right" ? "flex-end" : "flex-start",
                            mt: 1,
                            px: 2
                        }}
                    >
                        {sent && <Typography
                            color="text.secondary"
                            noWrap
                            variant="caption"
                        >
                            {ago}
                            {" "}
                            ago
                        </Typography>}
                        {!sent && <Typography
                            color="text.secondary"
                            noWrap
                            variant="caption"
                        >
                            Sending...
                        </Typography>}
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

ConversationMessage.propTypes = {
    authorAvatar: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    contentType: PropTypes.string.isRequired,
    createdAt: PropTypes.number.isRequired,
    position: PropTypes.oneOf(["left", "right"])
};
