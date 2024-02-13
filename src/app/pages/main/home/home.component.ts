import { Component, OnInit } from '@angular/core';
import { CarouselComponent } from '../../../components/carousel/carousel.component';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredProducts = [
    { 
      id: '1',
      name: 'Crema Rejuvenecedora', 
      description: 'La Crema Rejuvenecedora es una fórmula avanzada que revitaliza la piel, proporcionando hidratación intensiva y combatiendo los signos del envejecimiento.',
      image: 'assets/images/insta-item3.jpg',
      price: 99
    },
    { 
      id: '2',
      name: 'Crema Rejuvenecedora', 
      description: 'La Crema Rejuvenecedora es una fórmula avanzada que revitaliza la piel, proporcionando hidratación intensiva y combatiendo los signos del envejecimiento.',
      image: 'assets/images/insta-item3.jpg',
      price: 99
    },
    { 
      id: '3',
      name: 'Crema Rejuvenecedora', 
      description: 'La Crema Rejuvenecedora es una fórmula avanzada que revitaliza la piel, proporcionando hidratación intensiva y combatiendo los signos del envejecimiento.',
      image: 'assets/images/insta-item3.jpg',
      price: 99
    },
    { 
      id: '3',
      name: 'Crema Rejuvenecedora', 
      description: 'La Crema Rejuvenecedora es una fórmula avanzada que revitaliza la piel, proporcionando hidratación intensiva y combatiendo los signos del envejecimiento.',
      image: 'assets/images/insta-item3.jpg',
      price: 99
    }
  ]
  ngOnInit() {
    var elems = document.querySelectorAll('.materialboxed');
    (window as any).M.Materialbox.init(elems);
    const instance = (window as any).M.Carousel.init(document.querySelector('.carousel'), { fullWidth: true, indicators: true });
    console.log(instance)
  }
}
