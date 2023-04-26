import 'react'
import {Group} from "../../types/calendar";
import {FC} from "react";
import {Box, Divider, Paper, Stack, Typography, useTheme} from "@mui/material";
import {format} from "date-fns";
import MapPinIcon from '@mui/icons-material/Place';
import LockedIcon from '@mui/icons-material/Lock';
import UnlockedIcon from '@mui/icons-material/LockOpen';
import {Link, useNavigate} from "react-router-dom";
import {EventAttendanceForm} from "../../sections/events/event-attendance-form";
import { RouterLink } from '../router-link';

export interface EventListTileProps {
    event?: Group,
}

export const EventListTile: FC<EventListTileProps> = (props) => {
    const {event} = props;
    const theme = useTheme();
    const navigate = useNavigate();

    // @ts-ignore
    const handleClick = (e) => {
        if (!e.target.parentElement.classList.contains('attendance-buttons')) {
            navigate(`/events/${event?.id}`);
        }
    };

    return (
        <div onClick={handleClick}>
            <Paper
                variant={'outlined'}
                sx={{
                    p:2,
                    m:2,
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'action.hover'
                    },
                }}
            >
                <Stack direction={'row'} spacing={2.5}>
                    <Paper variant={"outlined"} sx={{py:1.5, px:2.5, alignItems: "center", justifyContent: "center", minWidth: "80px"}}>
                        <Typography
                            textAlign={"center"}
                            color={theme.palette.primary.main}
                            variant={"subtitle2"}
                        >
                            {format(new Date(event?.start ?? 0), 'EEE')}
                        </Typography>
                        <Typography
                            variant={"h4"}
                            textAlign={"center"}
                        >
                            {format(new Date(event?.start ?? 0), 'd')}
                        </Typography>
                        <Typography
                            textAlign={"center"}
                            fontWeight={500}
                            lineHeight={1}
                            variant={"subtitle2"}
                        >
                            {format(new Date(event?.start ?? 0), 'LLL').toUpperCase()}
                        </Typography>
                    </Paper>
                    <Stack>
                        <Typography
                            variant={'subtitle1'}
                            sx={{mb: 0.5}}
                        >
                            {event?.title}
                        </Typography>
                        <Stack direction={'row'} alignItems={'center'} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <Stack direction={'row'} alignItems={'center'}>
                                <MapPinIcon
                                    // @ts-ignore
                                    fontSize={'sm'}
                                    sx={{
                                        color:'text.secondary',
                                        mr: 0.5
                                    }}
                                />
                                <Typography
                                    color={'text.secondary'}
                                    variant={'body2'}
                                >
                                    {event?.location.name}
                                </Typography>
                                <Typography
                                    color={'text.secondary'}
                                    variant={'subtitle2'}
                                    sx={{ px: 0.75 }}
                                >
                                    •
                                </Typography>
                            </Stack>
                            <Stack direction={'row'} alignItems={'center'}>
                                {event?.public
                                    ? <UnlockedIcon
                                        // @ts-ignore
                                        fontSize={'sm'}
                                        sx={{
                                            color:'text.secondary',
                                            mr: 0.5
                                        }}
                                    />
                                    : <LockedIcon
                                        // @ts-ignore
                                        fontSize={'sm'}
                                        sx={{
                                            color:'text.secondary',
                                            mr: 0.5
                                        }}
                                    />}
                                <Typography
                                    color={'text.secondary'}
                                    variant={'body2'}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {event?.public ? 'Public' : 'Members Only'}
                                </Typography>
                            </Stack>
                        </Stack>
                        {event?.attendance && (
                            <Box
                                sx={{pt: 1.5}}
                            >
                                <EventAttendanceForm event={event}/>
                            </Box>

                        )}
                        {!event?.attendance && event?.description && (
                            <Stack>
                                <Divider sx={{ my: 1 }}/>
                                <Typography
                                    variant={'body2'}
                                >
                                    {event?.description}
                                </Typography>
                            </Stack>
                        )}
                        {!event?.attendance && !event?.description && (
                            <Stack>
                                <Divider sx={{ my: 1 }}/>
                                <Typography
                                    variant={'body2'}
                                >
                                    {event?.location.formattedAddress}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </Paper>
        </div>
    )
}
