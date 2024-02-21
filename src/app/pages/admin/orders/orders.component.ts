import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order, User } from '../../../schema.database';
import { OrderService } from '../../../services/order.service';
import { Subscription } from 'rxjs';
import { CustomDatePipe } from '../../../pipes/custom-date.pipe';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CustomDatePipe, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  copy: Order[] = [];
  order = {} as Order;
  sub!: Subscription;
  user: User;
  constructor(private orderService: OrderService, private auth: AuthService) {
    this.user = this.auth.getUser();
  }

  ngOnInit() {
    this.sub = this.orderService.getOrders().subscribe(data => {
      this.orders = data;
      this.copy = [...this.orders];
    });
    (window as any).M.Modal.init(document.querySelector('.modal'), 
    { onCloseEnd: () => this.order = { } as Order });
  }

  filter(event: any) {
    const term = event.target.value;
    if (term && term.length > 2) {
      this.orders = this.orders.filter(a => a.ref.toLowerCase().includes(term.toLowerCase()));
    } else {
      this.orders = [...this.copy];
    }
  }

  edit(order: Order) {
    this.order = {...order};
  }
  
  async save() {
    let attendedBy = this.user.username;
    let status = this.order.status;
    let cancellationReason = this.order.cancellationReason || null;
    await this.orderService.updateStatus(this.order.id!, { status, cancellationReason, attendedBy });
    this.showAlert({ title: 'Cambios guardados', icon: 'success' });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private showAlert(params: any) {
    return (window as any).Swal.fire(params)as any;
  }
}
