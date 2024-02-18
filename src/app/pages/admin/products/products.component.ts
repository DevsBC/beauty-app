import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../schema.database';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  copy: Product[] = [];
  sub: Subscription;
  product = { } as Product;
  hasChanged = false;
  constructor(private productService: ProductService) {
    this.sub = this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.copy = [...this.products];
    });
  }

  async ngOnInit() {
    (window as any).M.Modal.init(document.querySelector('.modal'), 
    { onCloseEnd: () => this.product = { } as Product });
  }

  filter(event: any) {
    const term = event.target.value;
    const results = [];
    if (term && term.length > 2) {
      for (const Product of this.copy) {
        for (const key of Object.keys(Product)) {
          const value = Product[key as keyof Product];
          if (value && String(value).toLowerCase().includes(term.toLowerCase())) {
            results.push(Product);
          }
        }
      } 
      this.products = [...results];
    } else {
      this.products = [...this.copy];
    }
  }

  togglePasswordVisibility() {
    var passwordField = document.getElementById('password') as any;
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
  }

  save() {
    if (!this.hasChanged) {
      console.log('nothing has changed');
      return;
    }
    this.product.image = 'assets/images/products/' + this.product.image;
    if (this.product.id) {
      this.productService.setProduct(this.product, true);
    } else {
      if (this.product.name && this.product.price) {
        this.productService.setProduct(this.product);
      }
    }
    
    this.product = { } as Product;
    this.hasChanged = false;
  }

  edit(product: Product) {
    this.product = {...product};
  }

  remove() {
    if (this.product.id) {
      this.productService.deleteProduct(this.product);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
