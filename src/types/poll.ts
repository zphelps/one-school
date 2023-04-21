
export interface Poll {
    id: string;
    text: string;
    options: PollOption[];
    votes: number;
}

export interface PollOption {
    id: string;
    text: string;
    voterIDs: string[];
}
