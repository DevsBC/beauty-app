import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Cart, Product } from '../../../schema.database';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart: Cart;
  constructor(private cartService: CartService) {
    this.cart = this.cartService.getCart();
  }

  ngOnInit(): void {
    (window as any).M.Materialbox.init(document.querySelectorAll('.materialboxed'));
  }

  addQty(product: Product) {
    const value = (document.getElementById(product.id!) as any).value;
    this.cartService.addToCart(product, Number(value));
    this.cart = this.cartService.getCart();
  }
}
