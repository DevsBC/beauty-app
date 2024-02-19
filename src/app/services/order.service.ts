import { Injectable } from '@angular/core';
import { Cart, Order, User } from '../schema.database';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  collectionName = 'orders';
  constructor(private db: DatabaseService) { }

  async createOrder(cart: Cart, user: User) {
    const generateOrderRef = () => Math.floor(100000 + Math.random() * 900000).toString();

    const order: Order = {
      ref: generateOrderRef(),
      items: cart.items,
      itemsQuantity: cart.count,
      total: cart.total,
      status: 'Pendiente',
      attendedBy: null,
      hasArrived: false,
      username: user ? user.username : null
    }

    return await this.db.setDocument(this.collectionName, order) as Promise<Order>;
  }

  getOrders() {
    return this.db.getSnapshot(this.collectionName) as Observable<Order[]>;
  }

  getMyOrders(username: string) {
    return this.db.getCollection(this.collectionName, { property: 'username', condition: '==', value: username }) as Promise<Order[]>;
  }

  updateStatus(orderId: string, data: any) {
    return this.db.updateDocument(this.collectionName, orderId, data);
  }
}
