import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Cart, Order, Product, User } from '../../../schema.database';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart: Cart;
  order?: Order;
  user: User;
  constructor(private cartService: CartService, private orderService: OrderService, private auth: AuthService) {
    this.cart = this.cartService.getCart();
    this.user = this.auth.getUser();
  }

  ngOnInit(): void {
    (window as any).M.Materialbox.init(document.querySelectorAll('.materialboxed'));
  }

  addQty(product: Product) {
    const value = (document.getElementById(product.id!) as any).value;
    this.cartService.addToCart(product, Number(value));
    this.cart = this.cartService.getCart();
  }

  remove(product: Product) {
    this.cart = this.cartService.removeFromCart(product.id!);
  }

  empty() {
    this.cart = this.cartService.clearCart();
  }

  async open() {
    this.order = await this.orderService.createOrder(this.cart, this.user);
    let footer = '<a href="/register">Crear mi cuenta</a>';
    if (this.order?.username) {
      footer = '<a href="/profile">Ir a mi cuenta</a>';
    } else {
      sessionStorage.setItem('order', JSON.stringify(this.order));
    }
    this.empty();
    this.showAlert({ 
      title: 'Tu orden ha sido creada', 
      text: 'Puedes recoger tu orden directamente en la tienda con el numero: ' + this.order?.ref, 
      icon: 'success', 
      footer 
    }).then(() => window.location.href = '/');
  }

  close() {
   
  }

  showAlert(params: any) {
    return (window as any).Swal.fire(params) as any;
  }
}
