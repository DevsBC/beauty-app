import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Router } from '@angular/router';
import { AppointmentService } from './appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private db: DatabaseService, private router: Router, private appointmentService: AppointmentService) { }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  async createAccount(data: any, hash = true, edit = false) {
    if (!edit) {
      const users = await this.getUsers(data.username);
      if (users.length > 0) {
        throw new Error('User already exists');
      }
    }

    if (hash) {
      data.password = btoa(data.password);
    }
    const user = await this.db.setDocument('users', data);
    if (sessionStorage.getItem('cita')) {
      const appointment = JSON.parse(sessionStorage.getItem('cita')!);
      await this.appointmentService.updateAppointment(appointment.id, user.username);
      sessionStorage.removeItem('cita');

    }
    localStorage.setItem(user.role !== 'customer' ? 'token' : 'user', JSON.stringify(user));
  }

  async enterAccount(user: any) {
    localStorage.clear();
    const users = await this.getUsers(user.username);
    if (users.length === 0) {
      throw new Error('User does not exists');
    }
    const userRetrieved = users[0];
    if (user.password !== atob(userRetrieved.password)) {
      throw new Error('Password does not match');
    }
    localStorage.setItem(userRetrieved.role !== 'customer' ? 'token' : 'user', JSON.stringify(userRetrieved));
    return userRetrieved;
  }

  getUser() {
    const user = (localStorage.getItem('token') || localStorage.getItem('user'))!;
    return user ? JSON.parse(user) : null;
  }

  private async getUsers(name: string) {
    return await this.db.getCollection('users', { property: 'username', condition: '==', value: name }) as any[];

  }

}
