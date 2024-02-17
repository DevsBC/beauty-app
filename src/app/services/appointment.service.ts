import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs';
import { Appointment } from '../schema.database';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  collectionName = 'appointments';
  constructor(private db: DatabaseService) { }

  getAppointments() {
    return this.db.getSnapshot(this.collectionName) as Observable<Appointment[]>;
  }

  getEvents(todayEvents = false) {
    const path = this.db.getPath(this.collectionName);
    let request = query(collection(this.db.db, path), where('status', '==', 'Confirmada'));
    if (todayEvents) {
      const startOfToday = new Date();
      startOfToday.setHours(0,0,0,0);
      request = query(collection(this.db.db, path), where('status', '==', 'Confirmada'), where('date', '>=', startOfToday.toISOString()));
    }
    return new Observable<any>(observer => {
      return onSnapshot(request,
        (snapshot => {
          const data: any[] = [];
          snapshot.docs.forEach(d => {
            const obj = d.data() as any;
            data.push({ id: obj.id, title: obj.name, start: obj.date });
          });
          observer.next(data);
        }),
        (error => observer.error(error.message))
      );
    });
  }

  async setAppointment(data: Appointment, edit = false) {
    if (!edit) {
      const appointment = await this.getAppointment(data.date);
      if (appointment) {
        throw new Error('Appointment already exists with selected date');
      }
    }

    const appointment = await this.db.setDocument(this.collectionName, data);
    return appointment;
  }

  async updateAppointment(id: string, createdBy: string) {
    await this.db.updateDocument(this.collectionName, id, { createdBy });
  }

  async getAppointmentsByUsername(username: string) {
    const appointments: Appointment[] = await this.db.getCollection(this.collectionName, { property: 'createdBy', condition: '==', value: username });
    return appointments;
  }

  deleteappointment(appointment: Appointment) {
    return this.db.deleteDocument(this.collectionName, appointment);
  }

  private async getAppointment(date: string) {
    const appointments: Appointment[] = await this.db.getCollection(this.collectionName, { property: 'date', condition: '==', value: date });
    return appointments[0];
  }
}
