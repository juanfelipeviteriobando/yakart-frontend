import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CustomOrdersService, CustomOrder } from '../../services/custom-orders';

@Component({
  selector: 'app-admin-custom-orders',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    FormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './menu-custom-orders.html',
  styleUrl: './menu-custom-orders.scss',
})
export class AdminCustomOrdersComponent implements OnInit {
  private orderService = inject(CustomOrdersService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  orders: CustomOrder[] = [];

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    if (role !== 'admin') {
      this.router.navigate(['/']);
      return;
    }
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getCustomOrders().subscribe({
      next: (data) => (this.orders = data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los pedidos',
        }),
    });
  }

  updateStatus(order: CustomOrder) {
    if (!order.id_order) return;
    this.orderService.actualizarCustomOrder(order.id_order, { status: order.status }).subscribe({
      next: () =>
        this.messageService.add({
          severity: 'success',
          summary: 'Estado actualizado',
          detail: `El pedido fue marcado como "${order.status}".`,
        }),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el estado',
        }),
    });
  }
}
