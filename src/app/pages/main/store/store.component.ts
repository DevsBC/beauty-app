import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product, User } from '../../../schema.database';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit {
  products: Product[] = [];
  user: User;
  constructor(private productService: ProductService, private auth: AuthService,
              private cartService: CartService) {
    this.user = this.auth.getUser();
  }

  async ngOnInit() {
    this.products = await this.productService.getStore();
  }

  onClickAdd(product: Product) {
    this.cartService.addToCart(product);
  }
}
