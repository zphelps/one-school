export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageURL?: string;
    phone?: string;
    role: string;
    targetMembership: string[];
    fcmToken?: string;

    [key: string]: any;
}
