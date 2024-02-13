import { Component, Input } from '@angular/core';
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
}
