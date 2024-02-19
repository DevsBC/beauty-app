import { Injectable } from '@angular/core';
import { Cart, Product, User } from '../schema.database';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  user: User;
  private totalSubject = new BehaviorSubject<any>({ total: 0, count: 0 });

  constructor(private auth: AuthService) { 
    this.user = this.auth.getUser();
    const cart = this.getCart();
    this.calculateTotal(cart);
  }

  addToCart(product: Product, quantity?: number) {
    product.quantity = 1;
    delete product.stock;
    const cart = this.getCart();
    const index = cart.items.findIndex(i => i.id === product.id);
    console.log(index);
    if (index > -1) {
      if (quantity) {
        cart.items[index].quantity = quantity;
        product.quantity = quantity;
      } else {
        cart.items[index].quantity!++;
      }
    } else {
      if (quantity) {
        product.quantity = quantity;
      }
      cart.items.push(product);
    }
    const { total, count } = this.calculateTotal(cart);
    cart.count = count;
    cart.total = total;
    localStorage.setItem('cart', JSON.stringify(cart));
    return product;
  }

  removeFromCart(id: string) {
    const cart = this.getCart();
    cart.items = cart.items.filter(i => i.id !== id);
    const { total, count } = this.calculateTotal(cart);
    cart.count = count;
    cart.total = total;
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  } 

  clearCart() {
    localStorage.removeItem('cart');
    this.totalSubject.next({ total: 0, count: 0 });
    return this.getCart();
  }

  getTotal() {
    return this.totalSubject.pipe();
  }

  private calculateTotal(cart: Cart) {
    const count = cart.items.map(i => i.quantity!).reduce((partialSum, a) => partialSum + a, 0);
    const total = cart.items.map(i => i.price * i.quantity!).reduce((partialSum, a) => partialSum + a, 0);
    this.totalSubject.next({ total, count });
    return { total, count };
  }

  getCart() {
    let cart = {} as Cart;

    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart')!);
    } else {
      cart = {
        total: 0,
        count: 0,
        items: [],
        username: this.user ? this.user.username : null
      }
    }
    return cart;
  }
}
