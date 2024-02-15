import { Component, OnInit } from '@angular/core';
import { ScheduleAppointmentComponent } from '../../../components/schedule-appointment/schedule-appointment.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [ScheduleAppointmentComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  ngOnInit(): void {
   
  }
  
 

}
