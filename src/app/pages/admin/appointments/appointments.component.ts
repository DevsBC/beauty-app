import { Component, OnInit } from '@angular/core';
import { ScheduleAppointmentComponent } from '../../../components/schedule-appointment/schedule-appointment.component';
import { Appointment } from '../../../schema.database';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../../../services/appointment.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [ScheduleAppointmentComponent, DatePipe],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  sub: Subscription;
  constructor(private appointmentService: AppointmentService, private auth: AuthService) {
    this.sub = this.appointmentService.getAppointments().subscribe(data => {
      this.appointments = data;
      this.appointments.sort((a: any, b: any) => +new Date(a.date) - +new Date(b.date));
    });
  }
  ngOnInit(): void {}


  updateStatus(appoinment: Appointment, status: string) {
    const user = this.auth.getUser();
    appoinment.attendedBy = user.fullName;
    appoinment.status = status;
    this.appointmentService.setAppointment(appoinment, true);
  }

  
 

}
