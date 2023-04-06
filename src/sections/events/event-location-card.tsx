import 'react'
import {FC} from "react";
import {CalendarEvent} from "../../types/calendar";
import {Card, Divider, Paper, Stack, Typography} from "@mui/material";

interface EventLocationProps {
    event?: CalendarEvent;
}
export const EventLocationCard: FC<EventLocationProps> = (props) => {
    const { event } = props;
    return (
        <Card>
            <Stack>
                {event?.location?.mapImageURL && <img style={{maxHeight: "300px", objectFit: "cover"}} src={event?.location?.mapImageURL!}/>}
                <Stack sx={{px:3, pb: 3, pt:2}}>
                    <Typography variant={"subtitle1"}>{event?.location.name}</Typography>
                    <Typography>
                        {event?.location.formattedAddress}
                    </Typography>
                    <Divider sx={{my:1}}/>
                    <Typography>
                        {event?.location.description}
                    </Typography>
                </Stack>

            </Stack>
        </Card>
    )
}
