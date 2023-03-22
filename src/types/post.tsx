export interface Post {
    id: string;
    authorID: string;
    text?: string;
    createdAt: string;
    commentCount?: number;
    eventID?: string;
    groupID: string;
    gameID?: string;
    pollID?: string;
    videoURL?: string;
    targetIDs: string[];
    public: boolean;

    [key: string]: any;
}
