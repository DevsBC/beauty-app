import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../schema.database';
import { AuthService } from '../../services/auth.service';

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
export class CalendarComponent implements OnInit {
  readonly OPEN_BUSINESS = 10;
  readonly CLOSE_BUSINESS = 18;
  readonly currentUser: User;
  toolbar: any = {
    start: 'dayGridMonth,timeGridWeek,timeGridDay'
  }
  constructor(private auth: AuthService) {
    this.currentUser = this.auth.getUser();
    if (!this.currentUser || this.currentUser?.role === 'customer') {
      this.toolbar = undefined;
    }
  }
  @Output() onDateClick = new EventEmitter();

  ngOnInit(): void {
    const calendar = new (window as any).FullCalendar.Calendar(document.getElementById('calendar'), {
      initialView: 'timeGridWeek',
      locale: 'es',
      headerToolbar: this.toolbar,
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
            start: new Date(),
            end: this.currentUser?.role !== 'customer' ? null : new Date().setMonth(new Date().getMonth() + 1)
          }
        }
      },
      allDaySlot: false,
      selectable: true,
      eventMinHeight: 30,
      hiddenDays: [Days.SATURDAY, Days.SUNDAY],
      slotMinTime: `${this.OPEN_BUSINESS}:00`,
      slotMaxTime: `${this.CLOSE_BUSINESS}:00`,
      dateClick: (info: any) => {
        if (calendar.view.type === 'dayGridMonth') {
          return;
        }
        const hour = new Date(info.dateStr).getHours();
        if (hour >= this.OPEN_BUSINESS && hour <= this.CLOSE_BUSINESS) {
          this.onDateClick.emit(info);
        }
      }
    });
    calendar.render();
  }
}
