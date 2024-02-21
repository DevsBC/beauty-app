import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { Appointment } from '../../schema.database';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, BookingFormComponent, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  classColor = '';
  modalAppointment: any;
  count = 0;
  constructor(private router: Router, private cartService: CartService) {
    this.cartService.getTotal().subscribe(data => this.count = data.count);
  }
  ngOnInit(): void {
    this.modalAppointment = (window as any).M.Modal.init(document.querySelector('.modal'), {});
    document.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 80) {
        this.classColor = window.location.pathname === '/' ? 'transparent' : '';
      } else {
        this.classColor = '';
      }
    });
    
  }

  goToProfile() {
    if (localStorage.getItem('user')) {
      this.router.navigateByUrl('profile');
    } else {
      this.router.navigateByUrl('login');
    }
  }

  open() {
    this.modalAppointment.open();
  }

  close(data: Appointment) {
    let footer = '<a href="/register">Crear mi cuenta</a>';
    if (data.createdBy) {
      footer = '<a href="/profile">Ir a mi cuenta</a>';
    } else {
      sessionStorage.setItem('cita', JSON.stringify(data));
    }
    this.modalAppointment.close();
    this.showAlert({ title: 'Tu cita ha sido confirmada', footer });
  }

  showAlert(params: any) {
    (window as any).Swal.fire(params);
  }

}
