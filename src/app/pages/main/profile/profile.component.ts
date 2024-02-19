import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Appointment, Order, User } from '../../../schema.database';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AppointmentService } from '../../../services/appointment.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, DatePipe, TitleCasePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User;
  password = '';
  hasChanged = false;
  appointments: Appointment[] = [];
  orders: Order[] = [];
  constructor(private auth: AuthService, private userService: UserService, 
              private appointmentService: AppointmentService, private orderService: OrderService) {
    this.user = this.auth.getUser();
    this.password = this.user.password!;
  }

  async ngOnInit() {
    this.appointments = await this.appointmentService.getAppointmentsByUsername(this.user.username);
    this.orders = await this.orderService.getMyOrders(this.user.username);
    this.orders = this.orders.sort((a, b) => b.creationDate!.seconds - a.creationDate!.seconds);
    (window as any).M.Collapsible.init(document.querySelectorAll('.collapsible'));
  }

  logout() {
    this.auth.logout();
  }

  showContent(tab: string) {
    (document.getElementById('datosContent') as any).style.display = 'none';
    (document.getElementById('comprasContent') as any).style.display = 'none';
    (document.getElementById('citasContent') as any).style.display = 'none';
    (document.getElementById(tab + 'Content') as any).style.display = 'block';
  }

  togglePasswordVisibility() {
    var passwordField = document.getElementById('password') as any;
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
  }

  save() {
    if (!this.hasChanged) {
      console.log('nothing has changed');
      return;
    }
    if (this.password !== this.user.password) {
      this.user.password = btoa(this.user.password!);
      this.password = this.user.password;
    }
    this.userService.setUser(this.user, false, true);
    localStorage.setItem('user', JSON.stringify(this.user));
    this.showAlert('Cambios guardados');
    this.hasChanged = false;
  }

  cancelOrder(order: Order) {
    this.showAlert({
      title: "Cancelar Orden",
      text: "Deseas cancelar la order: " + order.ref,
      icon: "warning",
      input: "text",
      inputLabel: "Razón de cancelación",
      inputValue: "El cliente ha cancelado la orden",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'No',
      confirmButtonText: "Si, cancelar"
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await this.orderService.updateStatus(order.id!, { status: 'Cancelada', cancellationReason: result.value });
        order.status = 'Cancelada';
        order.cancellationReason = result.value;
        this.showAlert({
          title: "Cancelada!",
          text: "La orden " + order.ref + " ha sido cancelada",
          icon: "success"
        });
      }
    });
  }

  cancelAppointment(appointment: Appointment) {
    this.showAlert({
      title: "Cancelación de cita",
      text: "Deseas cancelar la cita: " + new Date(appointment.date),
      icon: "warning",
      input: "text",
      inputLabel: "Razón de cancelación",
      inputValue: "El cliente ha cancelado la cita",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'No',
      confirmButtonText: "Si, cancelar"
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await this.appointmentService.updateAppointment(appointment.id!, { status: 'Cancelada', cancellationReason: result.value });
        appointment.status = 'Cancelada';
        appointment.cancellationReason = result.value;
        this.showAlert({
          title: "Cancelada!",
          text: "La cita ha sido cancelada",
          icon: "success"
        });
      }
    });
  }

  async notifyMyArrival(order: Order) {
    await this.orderService.updateStatus(order.id!, { hasArrived: true });
    order.hasArrived = true;
  }

  private showAlert(params: any) {
    return (window as any).Swal.fire(params)as any;
  }
}
