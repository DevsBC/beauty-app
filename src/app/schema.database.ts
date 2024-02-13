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
}

export interface User extends Entity {
    username: string;
    fullName: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
}