export interface CalendarEvent {
    id: string;
    group: {
        id: string | undefined;
        name: string | undefined;
        imageURL: string | undefined;
        type: string | undefined;
    } | null;
    gameID: string | null;
    location: {
        formattedAddress: string | null;
        mapImageURL: string | null;
        name: string | null;
        format: string | null;
        description: string | null;
    }
    targetIDs: string[];
    public: boolean;
    attendance: {
        attending: string[];
        maybe: string[];
        notAttending: string[];
    } | null
    allDay: boolean;
    color?: string;
    description: string;
    end: number;
    start: number;
    title: string;
    imageURL: string | null;
}

export type CalendarView =
    | 'dayGridMonth'
    | 'timeGridWeek'
    | 'timeGridDay'
    | 'listWeek';
