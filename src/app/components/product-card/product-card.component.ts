import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../schema.database';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product = {} as Product;
  @Output() addToCart =  new EventEmitter();

  add() {
    this.addToCart.emit(this.product);
  }
}
