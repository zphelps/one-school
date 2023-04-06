
export interface Group {
    id: string;
    name: string;
    description: string | null;
    memberCount: number;
    backgroundImageURL: string | null;
    type: string;
    profileImageURL: string | null;
    isPrivate: boolean;
    creatorID: string;
}