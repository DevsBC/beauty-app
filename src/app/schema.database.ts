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
    stock: number;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Cart extends Entity {
    items: CartItem[];
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
