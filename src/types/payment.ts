
export interface Payment {
    id: string;
    name: string;
    description: string;
    issuedOn: number;
    dueOn: number;
    userIdsPaid: string[];
    lineItems: LineItem[];
    target: {
        id: string;
        name: string;
    };
}

export interface LineItem {
    id: string;
    amount: number;
    quantity: number;
    description: string;
}

export type PaymentStatus =
    | 'upcoming'
    | 'paid'
    | 'overdue';
