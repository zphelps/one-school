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

    [key: string]: any;
}
