import 'react'
import {Card, Divider, Paper, Stack, Typography} from "@mui/material";
import {EventDetailsTiles} from "./event-details-tiles";
import {Group} from "../../types/calendar";
import {FC} from "react";

interface EventTicketsCardProps {
    event?: Group;
}
export const EventTicketsCard: FC<EventTicketsCardProps> = (props) => {
    const { event } = props;
    return (
        <Card sx={{p: 3}}>
            <Stack>
                <Typography variant={"h5"} sx={{pb:2}}>
                    Ticket Details
                </Typography>
                <Paper variant={'outlined'} sx={{p:2, borderColor: '#e5e5e5'}}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Typography
                            variant={'subtitle1'}
                        >
                            {event?.attendance?.ticket?.name}
                        </Typography>
                        <Typography
                            variant={'subtitle1'}
                        >
                            ${
                            // @ts-ignore
                            parseFloat(event?.attendance?.ticket?.price).toFixed(2)}
                        </Typography>
                    </Stack>
                    <Typography
                        variant={'caption'}
                    >
                        {event?.attendance?.ticket?.quantity
                            ? `${event?.attendance?.ticket?.quantity} available `
                            : 'Unlimited available '}
                        • {event?.attendance?.ticket?.sold} sold
                    </Typography>
                    {event?.attendance?.ticket?.description && <Stack>
                        <Divider sx={{my: 1, borderColor: "#e5e5e5"}}/>
                        <Typography>
                            {event?.attendance?.ticket?.description}
                        </Typography>
                    </Stack>}
                </Paper>
            </Stack>
        </Card>
    )
}
