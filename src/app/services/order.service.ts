import { Injectable } from '@angular/core';
import { Cart, Order, User } from '../schema.database';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';

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

  getCurrentOrders() {
    const path = this.db.getPath(this.collectionName);
    return new Observable<any>(observer => {
      return onSnapshot(query(collection(this.db.db, path), where('status', '==', 'Pendiente'), orderBy('creationDate', 'asc')),
        (snapshot => {
          const data: any[] = [];
          snapshot.docs.forEach(d => data.push(d.data()));
          observer.next(data);
        }),
        (error => observer.error(error.message))
      );
    });
    
  }

  getMyOrders(username: string) {
    return this.db.getCollection(this.collectionName, { property: 'username', condition: '==', value: username }) as Promise<Order[]>;
  }

  updateStatus(orderId: string, data: any) {
    return this.db.updateDocument(this.collectionName, orderId, data);
  }
}
