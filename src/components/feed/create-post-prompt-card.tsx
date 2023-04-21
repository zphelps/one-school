import 'react'
import {Avatar, Card, InputAdornment, Paper, Stack, TextField, Typography} from "@mui/material";
import {useAuth} from "../../hooks/use-auth";
import {HoverGrowthCard} from "../groups/group-card";
import {PostDialog} from "./create-post-dialog";
import {useDialog} from "../../hooks/use-dialog";
import {useCallback} from "react";

export const CreatePostPromptCard = () => {
    const auth = useAuth()

    const createDialog = useDialog();

    const handleAddClick = useCallback(
        (): void => {
            createDialog.handleOpen();
        },
        [createDialog.handleOpen]
    );


    return (
        <>
            <HoverGrowthCard
                onClick={handleAddClick}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >
                <Paper
                    variant={'outlined'}
                    sx={{
                        p: 2,
                        borderColor: '#eeeeee',
                    }}
                >
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Avatar src={auth.user?.imageURL}/>
                        <Typography
                            variant={'body1'}
                            color={'text.secondary'}
                        >
                            What would you like to share with the group, {auth.user?.firstName}?
                        </Typography>
                    </Stack>
                </Paper>
            </HoverGrowthCard>
            <PostDialog
                action="create"
                onAddComplete={createDialog.handleClose}
                onClose={createDialog.handleClose}
                open={createDialog.open}
            />
        </>
    )
}
