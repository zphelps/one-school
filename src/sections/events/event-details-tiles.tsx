import 'react'
import {Box, Divider, Paper, Stack, SvgIcon, Typography, useTheme} from "@mui/material";
import {Calendar, Lock01, LockUnlocked01, MarkerPin01} from "@untitled-ui/icons-react";
import {format} from "date-fns";
import {Group} from "../../types/calendar";
import {FC} from "react";

interface EventAboutTilesProps {
    event?: Group;
}
export const EventDetailsTiles: FC<EventAboutTilesProps> = (props) => {
    const { event } = props;
    const theme = useTheme();

    return (
        <Stack
            spacing={2}
        >

            <Stack direction={"row"} spacing={2}>
                <Box sx={{
                    width: "50px",
                    height:"50px",
                    aspectRatio: "1/1",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    background: theme.palette.primary.alpha8,
                    borderRadius: "10px"
                }}>
                    <SvgIcon fontSize="small">
                        <Calendar color={theme.palette.primary.main}/>
                    </SvgIcon>
                </Box>
                <Stack
                    sx={{
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        variant={"subtitle1"}
                    >
                        {format(new Date(event?.start ?? 0), 'PPPP')}
                        {event?.end != null && new Date(event?.end ?? 0).getDay() !== new Date(event?.start ?? 0).getDay()
                            ? ` - ${format(new Date(event?.end ?? 0), 'PPPP')}` : ''}
                    </Typography>
                    <Typography>
                        {`${format(new Date(event?.start ?? 0), 'p')}  ${event?.end != null ? `- ${format(new Date(event?.end ?? 0), 'p')}` : ''}`}
                    </Typography>
                </Stack>
            </Stack>

            <Stack direction={"row"} spacing={2}>
                <Box sx={{
                    aspectRatio: "1/1",
                    width: "50px",
                    height:"50px",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    background: theme.palette.primary.alpha8,
                    borderRadius: "10px"
                }}>
                    <SvgIcon fontSize="small">
                        <MarkerPin01 color={theme.palette.primary.main}/>
                    </SvgIcon>
                </Box>
                <Stack
                    sx={{
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant={"subtitle1"}>{event?.location.name}</Typography>
                    <Typography
                        variant={"body1"}
                    >
                        {event?.location.formattedAddress}
                    </Typography>
                </Stack>
            </Stack>

            <Stack direction={"row"} spacing={2}>
                <Box sx={{
                    width: "50px",
                    height:"50px",
                    aspectRatio: "1/1",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    background: theme.palette.primary.alpha8,
                    borderRadius: "10px"
                }}>
                    <SvgIcon fontSize="small">
                        {event?.public
                            ? <LockUnlocked01 color={theme.palette.primary.main}/>
                            : <Lock01 color={theme.palette.primary.main}/>}
                    </SvgIcon>
                </Box>
                <Stack
                    sx={{
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant={"subtitle1"}>{event?.public ? 'Public' : 'Members Only'}</Typography>
                    <Typography>
                        {event?.public
                            ? 'Anyone can view this event'
                            : 'Only members can view this event'}
                    </Typography>
                </Stack>
            </Stack>

            <Divider/>
            <Typography>
                {event?.description}
            </Typography>
        </Stack>
    )
}
