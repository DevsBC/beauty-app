import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Product } from '../schema.database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  collection = 'products';
  constructor(private db: DatabaseService) { }

  getProducts() {
    return this.db.getSnapshot(this.collection) as Observable<Product[]>;
  }

  async getFeaturedProducts() {
    const products = await this.db.getCollection(this.collection, { property: 'stock', condition: '>', value: 0 });
    // Make a copy of the products to avoid modifying the original
    const shuffledProducts = [...products];
    
    const randomProducts = [];

    while (randomProducts.length < Math.min(4, products.length)) {
      const randomIndex = Math.floor(Math.random() * shuffledProducts.length);
      const randomProduct = shuffledProducts.splice(randomIndex, 1)[0];
      randomProducts.push(randomProduct);
    }
  
    return randomProducts;
  }

  getStore() {
    return this.db.getCollection(this.collection, { property: 'stock', condition: '>', value: 0 }) as Promise<Product[]>;

  }

  async setProduct(data: Product, edit = false) {
    if (!edit) {
      const product = await this.getProduct(data.name);
      if (product) {
        throw new Error('product already exists');
      }
    }

    const product = await this.db.setDocument(this.collection, data);
    return product;
  }

  updateProduct(id: string, data: any) {
    return this.db.updateDocument(this.collection, id, data);
  }

  deleteProduct(product: Product) {
    return this.db.deleteDocument(this.collection, product);
  }

  private async getProduct(name: string) {
    const products: Product[] = await this.db.getCollection(this.collection, { property: 'name', condition: '==', value: name });
    return products[0];
  }
}
