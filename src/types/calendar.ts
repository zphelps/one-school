export interface CalendarEvent {
    id: string;
    group: {
        id: string | undefined;
        name: string | undefined;
        profileImageURL: string | undefined;
        backgroundImageURL: string | undefined;
        type: string | undefined;
    } | null;
    gameID: string | null;
    location: {
        formattedAddress: string | null;
        mapImageURL: string | null;
        name: string | null;
        format: string | null;
        description: string | null;
        url: string | null;
    }
    targetIDs: string[];
    public: boolean;
    attendance: Attendance | null;
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

export interface Attendance {
    id: string;
    RSVP: {
        attending: string[];
        maybe: string[];
        notAttending: string[];
        showGuestList: boolean;
    } | null
    ticket: {
        name: string;
        description: string;
        price: number;
        quantity: number;
        sold: number;
    } | null
}
