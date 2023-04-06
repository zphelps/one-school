import 'react'
import {FC} from "react";
import {CalendarEvent} from "../../types/calendar";
import {Card, Paper, Stack, Typography} from "@mui/material";
import {EventDetailsTiles} from "./event-details-tiles";

interface EventAttendanceProps {
    event?: CalendarEvent;
}
export const EventAttendanceCard: FC<EventAttendanceProps> = (props) => {
    const {event} = props;
    return (
        <Card sx={{p: 3}}>
            <Stack>
                <Typography variant={"h5"} sx={{pb:3}}>
                    Attendance
                </Typography>
                <Stack direction={"row"} justifyContent={"space-around"}>
                    <Stack>
                        <Typography
                            variant={"h5"}
                            textAlign={"center"}
                        >
                            {event?.attendance?.attending.length}
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
                            {event?.attendance?.maybe.length}
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
                            {event?.attendance?.notAttending.length}
                        </Typography>
                        <Typography
                            textAlign={"center"}
                        >
                            Not Going
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );
}
