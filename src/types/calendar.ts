export interface CalendarEvent {
    id: string;
    groupID: string;
    location: {
        formattedAddress: string;
        mapImageURL: string;
        name: string;
        format: string;
        description: string;
    }
    targetIDs: string[];
    public: boolean;
    attendance: {
        attending: string[];
        maybe: string[];
        notAttending: string[];
    }
    allDay: boolean;
    color?: string;
    description: string;
    end: number;
    start: number;
    title: string;
    imageURL: string;
}

export type CalendarView =
    | 'dayGridMonth'
    | 'timeGridWeek'
    | 'timeGridDay'
    | 'listWeek';
