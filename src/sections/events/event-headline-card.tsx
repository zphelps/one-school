import 'react'
import {Box, Paper, Stack, Typography, useTheme} from "@mui/material";
import {CalendarEvent} from "../../types/calendar";
import {FC} from "react";
import {format} from "date-fns";
import {EventAttendanceForm} from "./event-attendance-form";

interface EventHeadlineCardProps {
    event?: CalendarEvent;
}

export const EventHeadlineCard: FC<EventHeadlineCardProps> = (props) => {
    const { event } = props;
    const theme = useTheme();

    return (
        <Paper variant="outlined" sx={{width: "100%"}}>
            {event?.imageURL && <img
                src={event.imageURL}
                alt="event image"
                style={{
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    objectFit: "cover",
                    width: "100%",
                    height: "200px"
                }}
            />}
            <Box sx={{p:2, left: "20px", top: "175px"}}>
                <Stack direction="row" justifyContent="start" spacing={3}>
                    <Paper variant={"outlined"} sx={{py:2, px:2.5, alignItems: "center", justifyContent: "center"}}>
                        <Typography
                            textAlign={"center"}
                            color={theme.palette.primary.main}
                            variant={"subtitle2"}
                        >
                            {format(new Date(event?.start ?? 0), 'EEEE')}
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
                        >
                            {format(new Date(event?.start ?? 0), 'LLL').toUpperCase()}
                        </Typography>
                    </Paper>
                    <Stack direction="column">
                        <Typography
                            variant="subtitle1"
                            color={"lightslategray"}
                            fontWeight={"bold"}
                            sx={{
                                pb: 0.75,
                            }}
                        >
                            {`${format(new Date(event?.start ?? 0), 'PPPP')}`.toUpperCase()}
                        </Typography>
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{mb: 1}}
                            fontWeight={700}
                        >
                            {event?.title}
                        </Typography>
                        <EventAttendanceForm event={event} />
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    )
}
