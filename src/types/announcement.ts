
export interface Announcement {
    id: string;
    title: string;
    body: string;
    createdOn: number;
    author: {
        id: string;
        firstName: string;
        lastName: string;
        imageURL: string;
    }
    targets: {
        id: string;
        name: string;
        targetType: string;
    }[];
}
