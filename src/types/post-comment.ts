
export interface PostComment {
    id: string;
    body: string;
    createdAt: number;
    likeCount: number;
    author: {
        id: string;
        firstName: string;
        lastName: string;
        imageURL: string;
    };
}
