import 'react'
import {useEffect, useState} from "react";
import {DateCalendar, PickersDay, PickersDayProps, StaticDatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Divider,
    ListItem,
    ListItemAvatar, ListItemSecondaryAction,
    ListItemText,
    Paper,
    Stack, styled,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {format} from "date-fns";
import {PreviewDialogData, useCurrentEvent, useEvents} from "../../pages/calendar/calendar";
import {CalendarEvent} from "../../types/calendar";
import { Dayjs } from 'dayjs';
import {CalendarEventPreviewDialog} from "./calendar-event-preview-dialog";
import {useDialog} from "../../hooks/use-dialog";

export const MiniCalendar = () => {
    const [date, setDate] = useState(dayjs().toDate())
    const navigate = useNavigate();
    const events = useEvents();
    const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([])

    const previewDialog = useDialog<PreviewDialogData>();
    const updatingEvent = useCurrentEvent(events, previewDialog.data);

    useEffect(() => {
        if(Object.keys(events).length == 0) return;
        setFilteredEvents(events.filter(event => {
            if(event.start == null || event.end == null) return false;
            const start = format(event.start, 'yyyy-MM-dd')
            const end = format(event.end, 'yyyy-MM-dd')
            const selected = format(date, 'yyyy-MM-dd')
            return start <= selected && end >= selected
        }))
    }, [date, events])

    // @ts-ignore
    return (
        <Card sx={{py: 2, maxWidth: '375px', minWidth: '375px'}}>
            <Stack direction={"row"} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant={"h6"} sx={{px: 3, pt:0.5}}>Events</Typography>
                <Button
                    size={"small"}
                    sx={{mr:1.25}}
                    onClick={() => navigate('/calendar')}
                >
                    View All
                </Button>
            </Stack>

            <Divider sx={{mt:1.85, mb: 0.25}}/>
            <DateCalendar
                sx={{maxWidth: {xs: '300px', md: '400px'}}}
                slotProps={{day: {
                    sx: {
                        '&.MuiPickersDay-root': {
                            width: '40px',
                            height: '36px',
                            marginBottom: '10px',
                            marginRight: '8px',
                            // marginLeft: '8px',
                            fontSize: '15px'
                        },
                    },
                }}}
                views={['day']}
                onChange={(newDate) => setDate(newDate!)}
                value={date}
            />
            <Divider sx={{mb: 2}}/>
            <Box sx={{px:2}}>
                <Paper variant={'outlined'} sx={{p:0.35, mb: 1}}>
                    <Typography
                        variant={'subtitle1'}
                        textAlign={'center'}
                    >
                        {`${format(date, 'PPPP')}`}
                    </Typography>
                </Paper>
                {events && filteredEvents.map(event => (
                    <Stack
                        // component="li"
                        direction="row"
                        // onClick={onSelect}
                        key={event.id}
                        spacing={2}
                        sx={{
                            px: 1,
                            borderRadius: 2.5,
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            },
                        }}
                    >
                        <ListItem
                            disablePadding
                            onClick={() => previewDialog.handleOpen({
                                eventId: event.id
                            })}
                        >
                            <ListItemAvatar>
                                <Avatar src={event.group?.imageURL}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={event.title}
                                secondary={event.location?.name}

                            />
                            <Box
                                minWidth={'65px'}
                            >
                                <Typography
                                    variant={'subtitle2'}
                                    color={'text.secondary'}
                                    textAlign={'right'}
                                >
                                    {format(event.start, 'p')}
                                </Typography>
                            </Box>

                        </ListItem>
                    </Stack>
                ))}
                {filteredEvents.length == 0 && (
                    <Typography
                        sx={{mt: 3, mb: 1}}
                        variant={'subtitle1'}
                        textAlign={'center'}
                        color={'text.secondary'}
                    >
                        No events today
                    </Typography>
                )}
            </Box>
            <CalendarEventPreviewDialog
                event={updatingEvent}
                onClose={previewDialog.handleClose}
                open={previewDialog.open}
            />

        </Card>
    )
}
