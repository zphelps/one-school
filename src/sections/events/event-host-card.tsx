import 'react'

import {Paper, Stack, Typography, Box, Card} from "@mui/material";
import React, {FC, useEffect, useState} from "react";
import {CalendarEvent} from "../../types/calendar";
import {useDocument} from "../../hooks/firebase/useDocument";
import {Group} from "../../types/group";
import Background from "../../assets/placeholders/background.png";
import Profile from "../../assets/placeholders/profile.png";

interface EventHostCardProps {
    groupID?: string;
}

export const EventHostCard: FC<EventHostCardProps> = (props) => {
    const { groupID } = props;
    const [group, setGroup] = useState<Group>()
    const {document: groupDoc, error, isPending} = useDocument('groups', groupID!)

    useEffect(() => {
        if (groupDoc) {
            setGroup(groupDoc)
        }
    }, [groupDoc])

    return (
        <Card sx={{ mb: 2, borderRadius: '8px' }}>
            <img
                src={group?.backgroundImageURL ?? Background}
                alt="alumnus background photo"
                style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', objectFit: 'cover', width: '100%', height: '140px' }}
            />
            <Box sx={{ mt: -9, pl: 2.5, pr: 1, pb: 2.5, left: '20px', top: "175px" }}>
                <img
                    src={group?.profileImageURL ?? Profile}
                    alt="alumnus profile photo"
                    style={{ objectFit: 'cover', width: '6.5em', height: '6.5em', borderRadius: '500px', border: '4px solid #fff' }}
                />
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="column">
                        <Typography
                            variant="h5"
                            component="div"
                            fontWeight={600}
                            sx={{ pt: 1 }}
                        >
                            {group?.name}
                        </Typography>
                        <Typography
                            variant='subtitle1'
                            sx={{
                                pt: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: "1",
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {`${group?.memberCount} members`}
                        </Typography>
                        {/*<Typography*/}
                        {/*    color="secondary.light"*/}
                        {/*    variant='body1'*/}
                        {/*    sx={{*/}
                        {/*        overflow: "hidden",*/}
                        {/*        textOverflow: "ellipsis",*/}
                        {/*        display: "-webkit-box",*/}
                        {/*        WebkitLineClamp: "1",*/}
                        {/*        WebkitBoxOrient: "vertical",*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    {`${alumnus.state}, ${alumnus.country}`}*/}
                        {/*</Typography>*/}
                    </Stack>
                </Stack>

            </Box>
        </Card>
    )
}
