import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarComponent } from '../../../components/calendar/calendar.component';
import { AppointmentService } from '../../../services/appointment.service';
import { Message, Order, Product, User } from '../../../schema.database';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/order.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ContactService } from '../../../services/contact.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalendarComponent, FormsModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  user: User;
  orders: Order[] = [];
  products: Product[] = [];
  messages: Message[] = [];
  ordersSubscription!: Subscription;
  productsSubscription!: Subscription;
  order = {} as Order;
  orderAnalytics: any = {};
  appointmentAnalytics: any = {};
  constructor(private appointmentService: AppointmentService, private auth: AuthService,
              private orderService: OrderService, private productService: ProductService,
              private contactService: ContactService) {
    this.user = this.auth.getUser();
  }

  async ngOnInit() {
    (window as any).M.Modal.init(document.querySelector('.modal'), 
    { onCloseEnd: () => this.order = { } as Order });
    this.ordersSubscription = this.orderService.getCurrentOrders().subscribe(data => { 
      this.orders = data;
      setTimeout(() => (window as any).M.Materialbox.init(document.querySelectorAll('.materialboxed')))
    });
    this.productsSubscription = this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
    this.messages = await this.contactService.getMessages();
    if (this.user.role === 'manager') {
      this.orderAnalytics = await this.orderService.getAnalytics();
      this.appointmentAnalytics = await this.appointmentService.getAnalytics();
    }
  }

  onEventClick(event: any) {
    this.showAlert({
      title: event.title,
      text: event.extendedProps.notes,
      showDenyButton: true,
      confirmButtonText: 'Completar',
      denyButtonText: 'Cancelar cita'
    }).then((result: any) => {
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
    this.order = order;
    for (const item of order.items) {
      item.stock = this.products.find(i => i.id === item.id)?.stock;
    }
  }

  confirmOrder(order: Order) {
    this.showAlert({
      title: "Confirmación de Orden",
      text: "Asegurate antes de confirmar que la orden puede ser surtida",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, confirmar orden"
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const stocks = order.items.map(i => ({ qty: i.stock, id: i.id, stock: (i.stock! - i.quantity!) }));
        if (stocks.some(s => s.qty === 0)) {
          this.showAlert({
            title: "Productos faltantes?",
            text: "La orden no puede ser surtida si no hay existencias",
            icon: "error"
          })
          return;
        }

        for (const product of stocks) {
          let stock = 0;
          if (product.stock > 0) {
            stock = product.stock;
          }
          await this.productService.updateProduct(product.id!, { stock });
        }

        await this.orderService.updateStatus(order.id!, { status: 'Confirmada', attendedBy: this.user.username });
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

  cancelOrder(order: Order) {
    this.showAlert({
      title: "Cancelación de orden",
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
        if (order.status !== 'Pendiente') {
          for (const item of order.items) {
            const product = this.products.find(p => p.id === item.id);
            if (product) {
              product.stock! += item.quantity!;
              await this.productService.updateProduct(product.id!, { stock: product.stock });
            }
          }
        }
        await this.orderService.updateStatus(order.id!, { status: 'Cancelada', cancellationReason: result.value, attendedBy: this.user.username });
        this.showAlert({
          title: "Cancelada!",
          text: "La order ha sido cancelada",
          icon: "success"
        });
      }
    });
  }

  deliverOrder(order: Order) {
    this.showAlert({
      title: "El cliente ha pagado",
      text: "Asegurate antes de entregar que la orden ha sido pagada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar Orden",
      confirmButtonText: "Si, entregar orden"
    }).then(async (result: any) => {
      console.log(result)
      if (result.isConfirmed) {
        await this.orderService.updateStatus(order.id!, { status: 'Completada', attendedBy: this.user.username });
        this.showAlert({
          position: "top-end",
          icon: "success",
          title: "Excelente trabajo " + this.user.fullName,
          showConfirmButton: false,
          timer: 1500
        })
      } else if (result.dismiss === 'cancel') {
        this.cancelOrder(order);
      }
    })
  }

  async seen(message: Message) {
    await this.contactService.updateMessage(message.id!, { seen: true, attendedBy: this.user.username });
    this.messages = this.messages.filter(m => m.id !== message.id);
  }

  ngOnDestroy(): void {
    this.ordersSubscription.unsubscribe();
    this.productsSubscription.unsubscribe();
  }

  private showAlert(params: any) {
    return (window as any).Swal.fire(params)as any;
  }
}
