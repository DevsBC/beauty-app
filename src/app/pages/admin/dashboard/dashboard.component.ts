import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarComponent } from '../../../components/calendar/calendar.component';
import { AppointmentService } from '../../../services/appointment.service';
import { Order, User } from '../../../schema.database';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/order.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalendarComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  user: User;
  orders: Order[] = [];
  sub!: Subscription;
  order = {} as Order;
  constructor(private appointmentService: AppointmentService, private auth: AuthService,
              private orderService: OrderService) {
    this.user = this.auth.getUser();
  }

  ngOnInit(): void {
    this.sub = this.orderService.getCurrentOrders().subscribe(data => { 
      this.orders = data;
      setTimeout(() => (window as any).M.Materialbox.init(document.querySelectorAll('.materialboxed')))
    });
  }

  onEventClick(event: any) {
    console.log(event);
    this.showAlert({
      title: event.title,
      showDenyButton: true,
      confirmButtonText: 'Completar',
      denyButtonText: 'Cancelar cita'
    }).then((result: any) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.confirmAppointment(event.id);
      } else if (result.isDenied) {
        this.cancelAppointment(event.id);
      }
    });
  }

  cancelAppointment(id: string) {
    this.showAlert({
      title: "Cancelación de cita",
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
        await this.appointmentService.updateAppointment(id, { status: 'Cancelada', cancellationReason: result.value, attendedBy: this.user.username });
        this.showAlert({
          title: "Cancelada!",
          text: "La cita ha sido cancelada",
          icon: "success"
        });
      }
    });
  }

  confirmAppointment(id: string) {
    this.showAlert({
      title: "El cliente ha pagado",
      text: "Asegurate antes de confirmar que la cita ha sido pagada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, confirmar cita"
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await this.appointmentService.updateAppointment(id, { status: 'Confirmada', attendedBy: this.user.username });
        this.showAlert({
          position: "top-end",
          icon: "success",
          title: "Excelente trabajo " + this.user.fullName,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  attendOrder(order: Order) {
    this.order = { ...order };
    const changeQuantity = (id: string) => console.log(id)
    let rows = '<tbody>';
    for (const item of this.order.items) {
      item.toSupply = item.quantity;
      console.log(item)
      rows += (`<tr>
        <td>${item.name}</td>
        <td>$ ${item.price} MXN</td>
        <td>${item.quantity}</td>
        <td><input id="${item.id}" type="number" oninput="${changeQuantity}"></form></td>
      </tr>`);
    }
    rows += '</tbody>'
    this.showAlert({
      title: 'Order ' + this.order.ref,
      width: 800,
      html: `
        <b>Confirma si los productos de la orden se encuentran disponibles</b>
        <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad Solicitada</th>
            <th>Cantidad Disponible</th>
          </tr>
        </thead>
        ${rows}
        <tfoot>
          <tr>
            <td colspan="2"><button class="btn">Actualizar Cantidades</button></td>
          </tr>
        </tfoot>
      </table>
      `,
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: 'Cancelar cita'
    }).then((result: any) => {
      console.log(this.order);
      if (result.isConfirmed) {
        if (order.status === 'Pendiente') {

        }
      } else if (result.isDenied) {
        this.cancelOrder(order);
      }
    });
  }

  cancelOrder(order: Order) {
    this.showAlert({
      title: "Cancelación de orden",
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
        //await this.appointmentService.updateAppointment(id, { status: 'Cancelada', cancellationReason: result.value, attendedBy: this.user.username });
        this.showAlert({
          title: "Cancelada!",
          text: "La order ha sido cancelada",
          icon: "success"
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private showAlert(params: any) {
    return (window as any).Swal.fire(params)as any;
  }
}
