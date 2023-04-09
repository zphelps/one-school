export interface GroupMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageURL?: string;
    phone?: string;
    role: string;
    grade: number;

    [key: string]: any;
}
