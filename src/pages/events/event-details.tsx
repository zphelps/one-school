import 'react'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDocument} from "../../hooks/firebase/useDocument";
import {Box, Container, Grid, Paper, Stack, Typography, useTheme} from "@mui/material";
import {CalendarEvent} from "../../types/calendar";
import {format} from "date-fns";
import {EventDetailsCard} from "../../sections/events/event-details-card";
import {EventHeadlineCard} from "../../sections/events/event-headline-card";
import {EventLocationCard} from "../../sections/events/event-location-card";
import {EventHostCard} from "../../sections/events/event-host-card";

export const EventDetails = () => {
    const params = useParams<{ eventId: string }>()
    const {document, error, isPending} = useDocument('events', params.eventId!)
    const [event, setEvent] = useState<CalendarEvent>();

    useEffect(() => {
        if (document) {
            setEvent(document)
        }
    },[document])

    return (
        <Container sx={{mt: 6}}>
            {isPending && <Typography>Loading...</Typography>}
            {error && <Typography>Error: {error}</Typography>}

            {event && <Grid container spacing={2} rowSpacing={2} justifyContent={"center"}>
                <Grid item xs={12} sm={12} md={12}>
                    <EventHeadlineCard event={event}/>
                </Grid>
                <Grid item xs={12} sm={12} md={7}>
                    <Stack spacing={2}>
                        <EventDetailsCard event={event}/>
                        <EventLocationCard event={event}/>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={12} md={5}>
                    <EventHostCard groupID={event?.groupID}/>
                </Grid>
            </Grid>}
        </Container>
    )
}
