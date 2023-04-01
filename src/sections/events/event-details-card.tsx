import 'react'
import {Card, Paper, Stack, Typography} from "@mui/material";
import {EventDetailsTiles} from "./event-details-tiles";
import {CalendarEvent} from "../../types/calendar";
import {FC} from "react";

interface EventAboutCardProps {
    event?: CalendarEvent;
}
export const EventDetailsCard: FC<EventAboutCardProps> = (props) => {
    const { event } = props;
    return (
        <Card sx={{p: 3}}>
            <Stack>
                <Typography variant={"h5"} sx={{pb:2}}>
                    Details
                </Typography>
                <EventDetailsTiles event={event} />
            </Stack>
        </Card>
    )
}
