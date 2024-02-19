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
  copy: Product[] = [];
  user: User;
  constructor(private productService: ProductService, private auth: AuthService,
              private cartService: CartService) {
    this.user = this.auth.getUser();
  }

  async ngOnInit() {
    this.products = await this.productService.getStore();
    this.copy = [...this.products];
  }

  filter(event: any) {
    const term = event.target.value;
    if (term && term.length > 2) { 
      this.products = this.copy.filter(p => p.name.toLowerCase().includes(term.toLowerCase()));
    } else {
      this.products = [...this.copy];
    }
  }

  onClickAdd(product: Product) {
    this.cartService.addToCart(product);
  }
}
