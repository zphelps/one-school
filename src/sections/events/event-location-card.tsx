import 'react'
import {FC} from "react";
import {Event} from "../../types/calendar";
import {Box, Card, Divider, Paper, Stack, Typography} from "@mui/material";

interface EventLocationProps {
    event?: Event;
}
export const EventLocationCard: FC<EventLocationProps> = (props) => {
    const { event } = props;

    const GOOGLE_MAPS_API_KEY = 'AIzaSyCGWaK8mKMUW8FZYHDvUQU-aJB5lGnsIHw'; // Replace with your API key

    const getMapImage = (event: Event) => {
        return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
            event.location.name! + event.location.formattedAddress!
        )}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(
            event.location.name! + event.location.formattedAddress!
        )}&key=${GOOGLE_MAPS_API_KEY}`;
    }

    const openGoogleMaps = (event: Event) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location.name! + event.location.formattedAddress!)}`;
        window.open(url, '_blank');
    };

    return (
        <Card>
            <Stack>
                {event?.location.formattedAddress &&
                    <img onClick={() => openGoogleMaps(event)} style={{maxHeight: "250px", objectFit: "cover"}} src={getMapImage(event)}/>
                }
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
