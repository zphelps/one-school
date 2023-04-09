import 'react'
import {FC, useCallback, useEffect, useState} from "react";
import {DateCalendar, PickersDay, PickersDayProps} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {format} from "date-fns";
import {PreviewDialogData, useCurrentEvent} from "../../pages/calendar/calendar";
import {CalendarEvent} from "../../types/calendar";
import { Dayjs } from 'dayjs';
import {CalendarEventPreviewDialog} from "./calendar-event-preview-dialog";
import {useDialog} from "../../hooks/use-dialog";
import {useSelector} from "react-redux";
import useCalendarEvents from "../../hooks/events/use-calendar-events";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import useGroupEvents from "../../hooks/events/use-group-events";

interface MiniCalendarProps {
    groupID?: string;
}

export const MiniCalendar: FC<MiniCalendarProps> = (props) => {
    const {groupID} = props;

    const [date, setDate] = useState(dayjs().toDate())
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState<number>();
    const [endDate, setEndDate] = useState<number>();

    let events: any;
    if(groupID) {
        // @ts-ignore
        const eventsSelector = useSelector((state) => state.groupEvents.data);
        events = eventsSelector[groupID];
        useGroupEvents(groupID, startDate, endDate);
    } else {
        // @ts-ignore
        events = useSelector((state) => state.calendarEvents.data);
        useCalendarEvents(startDate, endDate);
    }

    const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([])

    const previewDialog = useDialog<PreviewDialogData>();
    const updatingEvent = useCurrentEvent(events, previewDialog.data);

    useEffect(() => {
        const result = new Date(date);
        setStartDate(result.setDate(result.getDate() - 31));
        setEndDate(result.setDate(result.getDate() + 31));
    }, [])

    const handleViewChange = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        setStartDate(firstDayOfMonth.getTime());
        setEndDate(lastDayOfMonth.getTime());
    };

    useEffect(() => {
        if(!events || Object.keys(events).length == 0) return;
        setFilteredEvents(events.filter((event: CalendarEvent) => {
            if(event.start == null || event.end == null) return false;
            const start = format(event.start, 'yyyy-MM-dd')
            const end = format(event.end, 'yyyy-MM-dd')
            const selected = format(date, 'yyyy-MM-dd')
            return start <= selected && end >= selected
        }))
    }, [date, events])

    const countEventsOnDate = useCallback((date: number): number => {
        if(!events || Object.keys(events).length == 0) return 0;
        return events.filter((event: CalendarEvent) => {
            const endOfDay = new Date(date);
            endOfDay.setHours(23);
            endOfDay.setMinutes(59);
            endOfDay.setSeconds(59);
            return event.start >= date && event.start <= endOfDay.getTime()
        }).length;
    }, [events])

    function CustomDay(props: PickersDayProps<Dayjs>) {
        const { day, outsideCurrentMonth, ...other } = props;
        const adapter = new AdapterDateFns();
        // @ts-ignore
        let eventCount = countEventsOnDate(adapter.toJsDate(day).getTime());
        if(eventCount > 3) {
            eventCount = 3;
        }
        return (
            <div>
                <PickersDay day={day} outsideCurrentMonth={false} {...other} />
                {eventCount > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: 0,
                        }}
                    >
                        {Array.from({ length: eventCount }, (_, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: 'blue',
                                    borderRadius: '50%',
                                    width: 4,
                                    height: 4,
                                    margin: '0 1px',
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // @ts-ignore
    return (
        <Card sx={{py: 2, maxWidth: '375px'}}>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant={"h6"} sx={{px: 3, pt: 0.5}}>Calendar</Typography>
                <Button
                    size={"small"}
                    sx={{mr: 1.25}}
                    onClick={() => navigate("/calendar")}
                >
                    View All
                </Button>
            </Stack>

            <Divider sx={{mt: 1.85, mb: 0.25}}/>

            <DateCalendar
                onMonthChange={handleViewChange}
                sx={{maxWidth: {xs: '300px', md: '400px'}}}
                slotProps={{day: {
                    sx: {
                        '&.MuiPickersDay-root': {
                            width: '40px',
                            height: '40px',
                            marginBottom: '0px',
                            marginLeft: '4px',
                            marginRight: '4px',
                            // marginLeft: '8px',
                            fontSize: '15px'
                        },
                    },
                } as any}}
                views={['day']}
                // @ts-ignore
                slots={{day: CustomDay}}
                // @ts-ignore
                onChange={(newDate) => setDate(newDate!)}
                // @ts-ignore
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
