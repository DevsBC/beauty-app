interface Entity {
    id?: string;
    creationDate?: string;
    updateDate?: string;
    context?: string;
}

export interface Product extends Entity {
    name: string;
    image: string;
    description: string;
    price: number;
    quantity?: number;
    stock?: number;
}

export interface Cart extends Entity {
    items: Product[];
    total: number;
    count: number;
}

export interface User extends Entity {
    username: string;
    fullName: string;
    role: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
}

export interface Appointment extends Entity {
    name: string;
    date: string;
    services: string[];
    status: 'Confirmada' | 'Cancelada' | 'Completada' | string;
    createdBy: string | null;
    notes?: string;
    attendedBy?: string;
}
