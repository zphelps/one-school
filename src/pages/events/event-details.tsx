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
import {EventAttendanceCard} from "../../sections/events/event-attendance-card";
import {Seo} from "../../components/seo";

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
        <>
            <Seo title={`${event?.title} | OneSchool`}/>
            <Container sx={{my: 4}}>
                {isPending && <Typography>Loading...</Typography>}
                {error && <Typography>Error: {error}</Typography>}

                {event && <Grid container spacing={3} rowSpacing={3} justifyContent={"center"}>
                    <Grid item xs={12} sm={12} md={12}>
                        <EventHeadlineCard event={event}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={7}>
                        <Stack spacing={3}>
                            <EventDetailsCard event={event}/>
                            <EventLocationCard event={event}/>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5}>
                        <Stack spacing={3}>
                            {event.attendance != null && <EventAttendanceCard event={event}/>}
                            <EventHostCard groupID={event?.group?.id}/>
                        </Stack>
                    </Grid>
                </Grid>}
            </Container>
        </>
    )
}
