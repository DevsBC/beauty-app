import { Component, OnInit } from '@angular/core';
import { CarouselComponent } from '../../../components/carousel/carousel.component';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../schema.database';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}
  async ngOnInit() {
    (window as any).M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    (window as any).M.Carousel.init(document.querySelector('.carousel'), { fullWidth: true, indicators: true });
    this.featuredProducts = await this.productService.getFeaturedProducts();
  }

  onClickAdd(product: Product) {
    this.cartService.addToCart(product);
  }
}
