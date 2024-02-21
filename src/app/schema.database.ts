interface Entity {
    id?: string;
    creationDate?: { nanoseconds: number, seconds: number };
    updateDate?: { nanoseconds: number, seconds: number };
    context?: string;
}

export interface Product extends Entity {
    name: string;
    image: string;
    description: string;
    price: number;
    quantity?: number;
    stock?: number;
    toSupply?: number;
}

export interface Cart extends Entity {
    items: Product[];
    total: number;
    count: number;
    username: string | null;
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
    cancellationReason?: string;
}

export interface Order extends Entity {
    ref: string;
    items: Product[];
    itemsQuantity: number;
    total: number;
    status: 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Completada' | string;
    username: string | null;
    attendedBy: string | null;
    hasArrived: boolean;
    cancellationReason?: string | null;
}

export interface Message extends Entity {
    name: string;
    email: string;
    content: string;
}