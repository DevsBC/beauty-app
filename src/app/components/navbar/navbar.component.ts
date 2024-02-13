import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookingFormComponent } from '../booking-form/booking-form.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, BookingFormComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  classColor = '';
  constructor(private router: Router) {}
  ngOnInit(): void {
    (window as any).M.Modal.init(document.querySelectorAll('.modal'), {});
    document.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 80) {
        this.classColor = 'transparent';
      } else {
        this.classColor = '';
      }
    })
  }

  goToProfile() {
    if (localStorage.getItem('user')) {
      this.router.navigateByUrl('profile');
    } else {
      this.router.navigateByUrl('login');
    }
  }


}
