import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { User } from '../../schema.database';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';
import { Subscription } from 'rxjs';

enum Days {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnDestroy {
  events: { id: string, title: string, start: string }[] = [];
  @Output() onDateClick = new EventEmitter();
  readonly OPEN_BUSINESS = 10;
  readonly CLOSE_BUSINESS = 18;
  readonly currentUser: User;

  sub: Subscription;
  role: string;
  constructor(private auth: AuthService, private appointmentsService: AppointmentService) {
    this.currentUser = this.auth.getUser();
    this.role = this.currentUser ? this.currentUser.role : 'customer';
    this.sub = this.appointmentsService.getEvents().subscribe(data => {
      this.events = data;
      this.renderCalendar();
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  renderCalendar() {
    const calendar = new (window as any).FullCalendar.Calendar(document.getElementById('calendar'), {
      initialView: 'timeGridWeek',
      locale: 'es',
      headerToolbar: this.role === 'customer' ? undefined : {
        start: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      buttonText: {
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Dia',
        list: 'Lista'
      },
      views: {
        timeGridWeek: {
          validRange: {
            start: this.role !== 'customer' ? undefined : new Date(),
            end: this.role !== 'customer' ? undefined : new Date().setMonth(new Date().getMonth() + 1)
          }
        }
      },
      allDaySlot: false,
      selectable: true,
      nowIndicator: true,
      defaultTimedEventDuration: '00:30',
      hiddenDays: [Days.SATURDAY, Days.SUNDAY],
      slotMinTime: `${this.OPEN_BUSINESS}:00`,
      slotMaxTime: `${this.CLOSE_BUSINESS}:00`,
      events: this.events,
      dateClick: (info: any) => {
        if (calendar.view.type === 'dayGridMonth') {
          return;
        }
        const date = new Date(info.dateStr);
        const hour = date.getHours();
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        if (hour >= this.OPEN_BUSINESS && hour <= this.CLOSE_BUSINESS) {
          if (date.getDate() === currentDate.getDate()) {
            if (hour >= currentHour) {
              this.onDateClick.emit(info);
            }
          } else {
            this.onDateClick.emit(info);
          }
         
        }
      }
    });
    calendar.render();
  }
}
