export interface User {
    id: string;
    tenantID: string;
    firstName: string;
    lastName: string;
    email: string;
    imageURL?: string;
    phone?: string;
    role: string;
    targetMembership: string[];
    fcmToken?: string;
    isActive: boolean;
    lastActivity?: number;
    groupsMemberOf: {
        id: string;
        name: string;
        profileImageURL: string;
        type: string;
    }[];

    [key: string]: any;
}
