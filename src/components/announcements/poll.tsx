import {FC, useState} from "react";
import {Box, Button, CircularProgress, Paper, Typography} from "@mui/material";
import { styled } from "@mui/system";
import {Post} from "../../types/post";
import {PollOption} from "../../types/poll";
import {useAuth} from "../../hooks/use-auth";

const PollOptionContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    marginTop: theme.spacing(1.5),
}));

const PollProgressBar = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    borderRadius: theme.shape.borderRadius,
    zIndex: 0,
}));

interface PollComponentProps {
    post: Post;
    handleVote: (option: PollOption) => void;
}

const PollComponent: FC<PollComponentProps> = (props) => {
    const {post, handleVote} = props;
    const totalVotes = post.poll?.votes || 0;
    const auth = useAuth();

    return (
        <Paper variant={'outlined'} sx={{mx: 1.5, mb: 2, px:{xs: 2, md: 3}, pt:{xs: 2, md: 3}, pb: 1.75, borderColor: '#e5e5e5'}}>
            <Typography variant="h6" sx={{mb: 2}}>{post.poll!.text}</Typography>
            {post.poll!.options.map((option, index) => {
                const percentage = totalVotes === 0 ? 0 : Math.round((option.voterIDs.length / totalVotes) * 100);
                const hasVoted = post.poll!.options.some((option) => option.voterIDs.includes(auth!.user?.id!));
                return (
                    <PollOptionContainer key={option.id}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={async () => await handleVote(option)}
                            disabled={hasVoted}
                            sx={{
                                zIndex: 1,
                                position: "relative",
                                borderRadius: '6px',
                                justifyContent: hasVoted ? "flex-start" : "center" ,
                                ":disabled": {
                                    color: "text.primary",
                                }
                        }}
                        >
                            {option.text}
                        </Button>
                        {hasVoted && (
                            <PollProgressBar
                                sx={{
                                    width: `${percentage}%`,
                                    backgroundColor: 'grey',
                                    opacity: option.voterIDs.includes(auth.user?.id!) ? 0.6 : 0.1,
                                    transition: "width 3s cubic-bezier(0.000, 0.795, 0.000, 1.000)", // Adjust the duration of the animation here
                                }}
                            />
                        )}
                        {hasVoted && (
                            <Box
                                justifyContent={"center"}
                                width={'100px'}
                                display={"flex"}
                                sx={{backgroundColor: 'orange', opacity: 0.75}}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "4px",
                                        transform: "translate(-50%, -50%)",
                                        zIndex: 2,
                                        justifyContent: 'end'
                                    }}
                                >
                                    {percentage}%
                                </Typography>
                            </Box>
                        )}
                    </PollOptionContainer>
                );
            })}
            <Box
                sx={{mt: 1}}
                width={"100%"}
                display={"flex"}
                justifyContent={"flex-end"}
            >
                <Typography
                    variant="caption"
                    color={"text.secondary"}
                >
                    {post.poll?.votes} vote(s)
                </Typography>
            </Box>
        </Paper>
    );
};

export default PollComponent;
