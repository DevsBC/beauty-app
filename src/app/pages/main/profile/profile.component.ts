import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Appointment, User } from '../../../schema.database';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AppointmentService } from '../../../services/appointment.service';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, DatePipe, TitleCasePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User;
  password = '';
  hasChanged = false;
  appointments: Appointment[] = [];
  constructor(private auth: AuthService, private userService: UserService, private appointmentService: AppointmentService) {
    this.user = this.auth.getUser();
    this.password = this.user.password!;
  }

  async ngOnInit() {
    this.appointments = await this.appointmentService.getAppointmentsByUsername(this.user.username);
  }

  logout() {
    this.auth.logout()
  }

  showContent(tab: string) {
    (document.getElementById('datosContent') as any).style.display = 'none';
    (document.getElementById('comprasContent') as any).style.display = 'none';
    (document.getElementById('citasContent') as any).style.display = 'none';
    (document.getElementById(tab + 'Content') as any).style.display = 'block';
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
    if (this.password !== this.user.password) {
      this.user.password = btoa(this.user.password!);
      this.password = this.user.password;
    }
    this.userService.setUser(this.user, false, true);
    localStorage.setItem('user', JSON.stringify(this.user));
    this.showAlert('Cambios guardados');
    this.hasChanged = false;
  }

  private showAlert(params: any) {
    (window as any).Swal.fire(params);
  }
}
