import { Component, EventEmitter, Output } from '@angular/core';
import { ScheduleAppointmentComponent } from '../schedule-appointment/schedule-appointment.component';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [ScheduleAppointmentComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent {
  @Output() onSubmit = new EventEmitter();

  submitted(data: any) {
    this.onSubmit.emit(data);
  }
}
