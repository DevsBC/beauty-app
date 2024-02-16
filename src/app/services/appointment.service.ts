import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs';
import { Appointment } from '../schema.database';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  collection = 'appointments';
  constructor(private db: DatabaseService) { }

  getAppointments() {
    return this.db.getSnapshot(this.collection) as Observable<Appointment[]>;
  }

  async setAppointment(data: Appointment, edit = false) {
    if (!edit) {
      const appointment = await this.getAppointment(data.date);
      if (appointment) {
        throw new Error('Appointment already exists with selected date');
      }
    }

    const appointment = await this.db.setDocument(this.collection, data);
    return appointment;
  }

  deleteappointment(appointment: Appointment) {
    return this.db.deleteDocument(this.collection, appointment);
  }

  private async getAppointment(date: string) {
    const appointments: Appointment[] = await this.db.getCollection(this.collection, { property: 'date', condition: '==', value: date });
    return appointments[0];
  }
}
