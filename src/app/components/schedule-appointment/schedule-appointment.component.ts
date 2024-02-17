import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment, User } from '../../schema.database';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [CalendarComponent, DatePipe, FormsModule],
  templateUrl: './schedule-appointment.component.html',
  styleUrl: './schedule-appointment.component.css'
})
export class ScheduleAppointmentComponent {
  @Output() onSubmit = new EventEmitter();
  appointment = {} as Appointment;
  user: User;
  constructor(private auth: AuthService, private appointmentService: AppointmentService) { this.user = this.auth.getUser() }

  init() {
    (window as any).M.FormSelect.init(document.querySelector('select'));
    setTimeout(() =>  (document.querySelector('.select-dropdown') as any)?.click(), 500);
  }

  onDateClick(info: any) {
    this.appointment = {
      name: '',
      status: 'Confirmada',
      services: [ 'Corte de cabello' ],
      date: info.dateStr,
      createdBy: this.user ? this.user.username : null
    };
    this.init();
  }
  onClickEvent(event: any) {
    console.log(event);
  }

  async submit() {
    if (this.appointment.date && this.appointment.name) {
      const appointment = await this.appointmentService.setAppointment(this.appointment);
      this.onSubmit.emit(appointment);
      this.appointment = {} as Appointment;

    }
  }

}
