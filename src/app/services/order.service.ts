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
      return onSnapshot(query(collection(this.db.db, path), where('status',  'in', ['Pendiente', 'Confirmada']), orderBy('creationDate', 'asc')),
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

  async getAnalytics() {
    const orders: Order[] = await this.db.getCollection(this.collectionName, { property: 'status', condition: '==', value: 'Completada' });
    const count: any = { employees: {}, totals: {}, products: {} };
    const sum = (value: any) => (value || 0) + 1;
    const max = (obj: any, prop: string) => Object.keys(obj[prop]).reduce((a, b) => obj[prop][a] > obj[prop][b] ? a : b, '');
    let total = 0;
    for (const order of orders) {
      count.employees[order.attendedBy!] = sum(count.employees[order.attendedBy!]);
      count.totals[order.id!] = order.total;
      total += order.total;
      count.products[order.id!] = order.itemsQuantity;
    }

    count.topSale = count.totals[max(count, 'totals')];
    count.topProducts = count.products[max(count, 'products')];
    count.topEmployee = max(count, 'employees');
    count.average = Math.round(total / orders.length);
    return count;
  }
}
