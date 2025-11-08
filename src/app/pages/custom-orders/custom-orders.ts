import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';

import { CustomOrdersService, CustomOrder } from '../../services/custom-orders';
import { OrderAccessoriesService } from '../../services/order-accessories';
import { AccessoriesService, Accessory } from '../../services/accessories';

@Component({
  selector: 'app-custom-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ToastModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: './custom-orders.html',
  providers: [MessageService],
})
export class CustomOrdersComponent implements OnInit {
  private customOrdersService = inject(CustomOrdersService);
  private orderAccessoriesService = inject(OrderAccessoriesService);
  private accessoriesService = inject(AccessoriesService);
  private messageService = inject(MessageService);

  customOrders: CustomOrder[] = [];
  accessories: Accessory[] = [];
  selectedAccessories: number[] = [];

  uploadedImageUrl: string | null = null;
  priceEstimate = 0;

  newOrder: Partial<CustomOrder> = {
    id_client: 1,
    description: '',
    delivery_date: new Date(),
    size: 1,
  };

  ngOnInit(): void {
    this.loadCustomOrders();
    this.loadAccessories();
  }

  /** 🔹 Cargar órdenes existentes */
  loadCustomOrders(): void {
    this.customOrdersService.getCustomOrders().subscribe({
      next: (orders) => (this.customOrders = orders),
      error: (err) => console.error('Error cargando órdenes:', err),
    });
  }

  /** 🔹 Cargar accesorios reales desde la API */
  loadAccessories(): void {
    this.accessoriesService.getAccessories().subscribe({
      next: (accs) => (this.accessories = accs),
      error: (err) => console.error('Error cargando accesorios:', err),
    });
  }

  /** 🔹 Evento de carga de imagen */
  onUpload(event: any): void {
    const file = event.files[0];
    if (!file) return;
    this.uploadedImageUrl = URL.createObjectURL(file); // Vista previa local
    this.messageService.add({ severity: 'info', summary: 'Imagen cargada', detail: file.name });
  }

  /** 🔹 Recalcular precio estimado dinámicamente */
  calcularPrecio(): void {
    const base = 50;
    const sizeFactor = this.newOrder.size || 1;

    // Calcula el precio total de los accesorios seleccionados
    const accesoriosSeleccionados = this.accessories.filter(acc =>
      this.selectedAccessories.includes(acc.id)
    );
    const totalAccesorios = accesoriosSeleccionados.reduce((sum, acc) => sum + (acc.price || 0), 0);

    // Usa el campo price como cantidad
    const cantidad = this.newOrder.price || 1;

    this.priceEstimate = (base * sizeFactor + totalAccesorios) * cantidad;
  }

  /** 🔹 Crear una nueva orden personalizada */
  crearOrden(): void {
    if (!this.newOrder.description) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Debe ingresar una descripción.',
      });
      return;
    }

    const order: CustomOrder = {
      ...this.newOrder,
      image_url: this.uploadedImageUrl || null,
      price: this.priceEstimate,
      id_client: 1,
    } as CustomOrder;

    this.customOrdersService.crearCustomOrder(order).subscribe({
      next: (createdOrder) => {
        // 🔗 Vincular accesorios seleccionados
        this.selectedAccessories.forEach((idAcc) => {
          this.orderAccessoriesService.crearOrderAccessory({
            id_order: createdOrder.id_order!,
            id_accessory: idAcc,
          }).subscribe();
        });

        this.customOrders.push(createdOrder);
        this.messageService.add({
          severity: 'success',
          summary: 'Orden creada',
          detail: 'Tu orden fue registrada con éxito',
        });
        this.resetForm();
      },
      error: (err) => console.error('Error creando orden:', err),
    });
  }

  /** 🔹 Resetear formulario */
  resetForm(): void {
    this.newOrder = {
      id_client: 1,
      description: '',
      delivery_date: new Date(),
      size: 1,
    };
    this.uploadedImageUrl = null;
    this.selectedAccessories = [];
    this.priceEstimate = 0;
  }
}
