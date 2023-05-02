
export interface Group {
    id: string;
    name: string;
    description: string | null;
    memberCount: number;
    backgroundImageURL: string | null;
    type: string;
    profileImageURL: string | null;
    isPrivate: boolean;
    createdOn: number;
    category: string;
    creator: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        imageURL: string;
    }
}

export interface GroupMediaItem {
    id: string;
    createdAt: number;
    type: string;
    url: string;
}
