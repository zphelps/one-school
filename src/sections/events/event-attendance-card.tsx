import 'react'
import {FC} from "react";
import {CalendarEvent} from "../../types/calendar";
import {Card, Divider, Paper, Stack, Typography} from "@mui/material";
import {EventAttendanceForm} from "./event-attendance-form";

interface EventAttendanceProps {
    event?: CalendarEvent;
}
export const EventAttendanceCard: FC<EventAttendanceProps> = (props) => {
    const {event} = props;
    return (
        <Card sx={{p: 3}}>
            <Stack sx={{mb: 2}}>
                <Typography variant={"h5"} sx={{pb:3}}>
                    Attendance
                </Typography>
                <Stack direction={"row"} justifyContent={"space-around"}>
                    <Stack>
                        <Typography
                            variant={"h5"}
                            textAlign={"center"}
                        >
                            {event?.attendance?.RSVP?.attending.length}
                        </Typography>
                        <Typography
                            textAlign={"center"}
                        >
                            Going
                        </Typography>
                    </Stack>

                    <Stack>
                        <Typography
                            variant={"h5"}
                            textAlign={"center"}
                        >
                            {event?.attendance?.RSVP?.maybe.length}
                        </Typography>
                        <Typography
                            textAlign={"center"}
                        >
                            Maybe
                        </Typography>
                    </Stack>

                    <Stack>
                        <Typography
                            variant={"h5"}
                            textAlign={"center"}
                        >
                            {event?.attendance?.RSVP?.notAttending.length}
                        </Typography>
                        <Typography
                            textAlign={"center"}
                        >
                            Not Going
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
            <Divider sx={{my: 2, borderColor: '#e5e5e5'}}/>
            {event?.attendance?.RSVP && <EventAttendanceForm event={event}/>}
        </Card>
    );
}
