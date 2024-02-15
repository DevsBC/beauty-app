import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  appointment: any = {};
  readonly OPEN_BUSINESS = 10;
  readonly CLOSE_BUSINESS = 18;
  ngOnInit(): void {
    const modal = (window as any).M.Modal.init(document.querySelector('#modal-event'));
    const calendar = new (window as any).FullCalendar.Calendar(document.getElementById('calendar'), {
      initialView: 'timeGridWeek',
      headerToolbar: {
        start: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      allDaySlot: false,
      slotEventOverlap: false,
      eventMinHeight: 30,
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Thursday
      
        startTime: `${this.OPEN_BUSINESS}:00`, // a start time (10am in this example)
        endTime: `${this.CLOSE_BUSINESS}:00`, // an end time (6pm in this example)
      },
      slotMinTime: '8:00:00',
      slotMaxTime: '21:00:00',
      dateClick: (info: any) => {
        const hour = new Date(info.dateStr).getHours();
        if (hour >= this.OPEN_BUSINESS && hour <= this.CLOSE_BUSINESS) {
          this.appointment = {
            date: info.dateStr
          };
          modal.open();
        } else {
          console.log('nel pastel')
        }
        
      },
    });
    calendar.render();
  }

  onClickDate(info: any) {
   

  }
  onClickEvent(event: any) {
    console.log(event);
  }

}
