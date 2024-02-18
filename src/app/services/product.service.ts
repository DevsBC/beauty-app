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

  deleteProduct(product: Product) {
    return this.db.deleteDocument(this.collection, product);
  }

  private async getProduct(name: string) {
    const products: Product[] = await this.db.getCollection(this.collection, { property: 'name', condition: '==', value: name });
    return products[0];
  }
}
