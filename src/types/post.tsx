import {PostComment} from "./post-comment";
import {Poll} from "./poll";

export interface Post {
    id: string;
    author: {
        id: string;
        firstName: string;
        lastName: string;
        imageURL: string;
    };
    text?: string;
    createdAt: string;
    commentCount?: number;
    eventID?: string;
    groupID: string;
    gameID?: string;
    poll?: Poll | null;
    videoURL?: string;
    targetIDs: string[];
    public: boolean;
    topComment?: PostComment | null;

    [key: string]: any;
}
