import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import Calendar from '@fullcalendar/react';
import { Box, Card, Container, Stack, Theme, useMediaQuery } from '@mui/material';
import {CalendarEvent, CalendarView} from "../../types/calendar";
import {useDispatch, useSelector} from "react-redux";
import {useDialog} from "../../hooks/use-dialog";
import {Seo} from "../../components/seo";
import {CalendarContainer} from "../../sections/calendar/calendar-container";
import {CalendarToolbar} from "../../sections/calendar/calendar-toolbar";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import useCalendarEvents from "../../hooks/events/use-calendar-events";
import { CalendarEventPreviewDialog } from '../../sections/calendar/calendar-event-preview-dialog';

interface PreviewDialogData {
    eventId?: string;
}

interface CreateDialogData {
    range?: {
        start: number;
        end: number;
    };
}

interface UpdateDialogData {
    eventId?: string;
}

const useEvents = (): CalendarEvent[] => {
    useCalendarEvents();
    // @ts-ignore
    const events = useSelector((state) => state.calendarEvents.data);
    return events;
};

const useCurrentEvent = (
    events: CalendarEvent[],
    dialogData?: UpdateDialogData
): CalendarEvent | undefined => {
    return useMemo(
        (): CalendarEvent | undefined => {
            if (!dialogData) {
                return undefined;
            }

            return events.find((event) => event.id === dialogData!.eventId);
        },
        [dialogData, events]
    );
};

export const EventsCalendar = () => {
    const dispatch = useDispatch();
    const calendarRef = useRef<Calendar | null>(null);
    const events = useEvents();
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<CalendarView>(mdUp ? 'timeGridDay' : 'dayGridMonth');
    const previewDialog = useDialog<PreviewDialogData>();
    const createDialog = useDialog<CreateDialogData>();
    const updateDialog = useDialog<UpdateDialogData>();
    const updatingEvent = useCurrentEvent(events, previewDialog.data);

    const handleScreenResize = useCallback(
        (): void => {
            const calendarEl = calendarRef.current;

            if (calendarEl) {
                const calendarApi = calendarEl.getApi();
                const newView = mdUp ? 'dayGridMonth' : 'timeGridDay';

                calendarApi.changeView(newView);
                setView(newView);
            }
        },
        [calendarRef, mdUp]
    );

    useEffect(
        () => {
            handleScreenResize();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [mdUp]
    );

    const handleViewChange = useCallback(
        (view: CalendarView): void => {
            const calendarEl = calendarRef.current;

            if (calendarEl) {
                const calendarApi = calendarEl.getApi();

                calendarApi.changeView(view);
                setView(view);
            }
        },
        []
    );

    const handleDateToday = useCallback(
        (): void => {
            const calendarEl = calendarRef.current;

            if (calendarEl) {
                const calendarApi = calendarEl.getApi();

                calendarApi.today();
                setDate(calendarApi.getDate());
            }
        },
        []
    );

    const handleDatePrev = useCallback(
        (): void => {
            const calendarEl = calendarRef.current;

            if (calendarEl) {
                const calendarApi = calendarEl.getApi();

                calendarApi.prev();
                setDate(calendarApi.getDate());
            }
        },
        []
    );

    const handleDateNext = useCallback(
        (): void => {
            const calendarEl = calendarRef.current;

            if (calendarEl) {
                const calendarApi = calendarEl.getApi();

                calendarApi.next();
                setDate(calendarApi.getDate());
            }
        },
        []
    );

    const handleAddClick = useCallback(
        (): void => {
            createDialog.handleOpen();
        },
        [createDialog]
    );

    const handleRangeSelect = useCallback(
        (arg: DateSelectArg): void => {
            const calendarEl = calendarRef.current;

            if (calendarEl) {
                const calendarApi = calendarEl.getApi();

                calendarApi.unselect();
            }

            createDialog.handleOpen({
                range: {
                    start: arg.start.getTime(),
                    end: arg.end.getTime()
                }
            });
        },
        [createDialog]
    );

    const handleEventSelect = useCallback(
        (arg: EventClickArg): void => {
            previewDialog.handleOpen({
                eventId: arg.event.id
            });
        },
        [updateDialog]
    );

    const handleEventResize = useCallback(
        async (arg: EventResizeDoneArg): Promise<void> => {
            const { event } = arg;

            // try {
            //     await dispatch(thunks.updateEvent({
            //         eventId: event.id,
            //         update: {
            //             allDay: event.allDay,
            //             start: event.start?.getTime(),
            //             end: event.end?.getTime()
            //         }
            //     }));
            // } catch (err) {
            //     console.error(err);
            // }
        },
        [dispatch]
    );

    const handleEventDrop = useCallback(
        async (arg: EventDropArg): Promise<void> => {
            const { event } = arg;

            // try {
            //     await dispatch(thunks.updateEvent({
            //         eventId: event.id,
            //         update: {
            //             allDay: event.allDay,
            //             start: event.start?.getTime(),
            //             end: event.end?.getTime()
            //         }
            //     }));
            // } catch (err) {
            //     console.error(err);
            // }
        },
        [dispatch]
    );

    // @ts-ignore
    return (
        <>
            <Seo title="Calendar | OneSchool" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <CalendarToolbar
                            date={date}
                            onAddClick={handleAddClick}
                            onDateNext={handleDateNext}
                            onDatePrev={handleDatePrev}
                            onDateToday={handleDateToday}
                            onViewChange={handleViewChange}
                            view={view}
                        />
                        <Card>
                            <CalendarContainer>
                                <Calendar
                                    allDayMaintainDuration
                                    dayMaxEventRows={4}
                                    eventClick={handleEventSelect}
                                    eventDisplay="block"
                                    eventDrop={handleEventDrop}
                                    eventResizableFromStart
                                    eventResize={handleEventResize}
                                    events={events}
                                    headerToolbar={false}
                                    height={"80vh"}
                                    initialDate={date}
                                    initialView={view}
                                    plugins={[
                                        dayGridPlugin,
                                        interactionPlugin,
                                        listPlugin,
                                        timeGridPlugin,
                                        timelinePlugin
                                    ]}
                                    ref={calendarRef}
                                    rerenderDelay={10}
                                    select={handleRangeSelect}
                                    selectable
                                    weekends
                                />
                            </CalendarContainer>
                        </Card>
                    </Stack>
                </Container>
            </Box>
            <CalendarEventPreviewDialog
                event={updatingEvent}
                onClose={previewDialog.handleClose}
                open={previewDialog.open}
            />
            {/*<CalendarEventDialog*/}
            {/*    action="create"*/}
            {/*    onAddComplete={createDialog.handleClose}*/}
            {/*    onClose={createDialog.handleClose}*/}
            {/*    open={createDialog.open}*/}
            {/*    range={createDialog.data?.range}*/}
            {/*/>*/}
            {/*<CalendarEventDialog*/}
            {/*    action="update"*/}
            {/*    event={updatingEvent}*/}
            {/*    onClose={updateDialog.handleClose}*/}
            {/*    onDeleteComplete={updateDialog.handleClose}*/}
            {/*    onEditComplete={updateDialog.handleClose}*/}
            {/*    open={updateDialog.open}*/}
            {/*/>*/}
        </>
    );
};
