import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CustomOrdersService, CustomOrder } from '../../services/custom-orders';
import { OrderAccessoriesService } from '../../services/order-accessories';
import { AccessoriesService, Accessory } from '../../services/accessories';
import { CartItemsService } from '../../services/cart-item';

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
    HttpClientModule,
  ],
  templateUrl: './custom-orders.html',
  providers: [MessageService],
})
export class CustomOrdersComponent implements OnInit {
  private customOrdersService = inject(CustomOrdersService);
  private orderAccessoriesService = inject(OrderAccessoriesService);
  private accessoriesService = inject(AccessoriesService);
  private cartItemsService = inject(CartItemsService);
  private messageService = inject(MessageService);
  private http = inject(HttpClient);

  customOrders: CustomOrder[] = [];
  accessories: Accessory[] = [];
  selectedAccessories: number[] = [];

  uploadedImageUrl: string | null = null;
  priceEstimate: number = 0;

  private uploadApiUrl = 'http://localhost:3000/upload';

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

  onDeliveryDateChange(event: any) {
    const value = event.target.value;
    this.newOrder.delivery_date = value ? new Date(value) : new Date();
  }

  loadCustomOrders(): void {
    this.customOrdersService.getCustomOrders().subscribe({
      next: (orders) => (this.customOrders = orders),
      error: (err) => console.error('Error cargando órdenes:', err),
    });
  }

  loadAccessories(): void {
    this.accessoriesService.getAccessories().subscribe({
      next: (data) => (this.accessories = data),
      error: (err) => console.error('Error cargando accesorios:', err),
    });
  }

  toggleAccessory(id: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedAccessories.includes(id)) this.selectedAccessories.push(id);
    } else {
      this.selectedAccessories = this.selectedAccessories.filter((a) => a !== id);
    }
  }

  uploadImage(event: any): void {
    const file = event.files[0];
    if (!file) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ imageUrl: string }>(this.uploadApiUrl, formData, { headers }).subscribe({
      next: (res) => this.uploadedImageUrl = res.imageUrl,
      error: (err) => console.error('Error subiendo imagen:', err),
    });
  }

  /** 🔹 Calcular precio manual */
  calcularPrecio(): void {
    const base = 50;
    const sizeFactor = Number(this.newOrder.size) || 1;
    const accesoriosSeleccionados = this.accessories.filter((a) =>
      this.selectedAccessories.includes(a.id)
    );
    const totalAccesorios = accesoriosSeleccionados.reduce(
      (sum, a) => sum + Number(a.price || 0),
      0
    );
    this.priceEstimate = base * sizeFactor + totalAccesorios;
  }

  /** 🔹 Calcular precio “IA” (simulación frontend) */
  calcularPrecioIA(): void {
    if (!this.newOrder.description || !this.newOrder.size) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Datos insuficientes',
        detail: 'Debe ingresar descripción y tamaño antes de calcular precio IA.',
      });
      return;
    }

    const base = 50;
    const sizeFactor = Number(this.newOrder.size) || 1;
    const accesoriosSeleccionados = this.accessories.filter((a) =>
      this.selectedAccessories.includes(a.id)
    );
    const totalAccesorios = accesoriosSeleccionados.reduce((sum, a) => sum + Number(a.price || 0), 0);

    // 🔹 Simulación IA: agrega 20% extra si descripción incluye "premium" o "logo"
    let extra = 0;
    const desc = this.newOrder.description.toLowerCase();
    if (desc.includes('premium')) extra += 0.2;
    if (desc.includes('logo')) extra += 0.15;

    this.priceEstimate = (base * sizeFactor + totalAccesorios) * (1 + extra);

    this.messageService.add({
      severity: 'success',
      summary: 'Precio estimado IA',
      detail: `El precio estimado por IA es ${this.priceEstimate.toFixed(2)} USD.`,
    });
  }

  /** 🔹 Crear orden */
  crearOrden(): void {
    if (!this.newOrder.description || !this.newOrder.size || !this.newOrder.delivery_date) {
      alert('Debe completar todos los campos antes de crear la orden.');
      return;
    }

    const order: CustomOrder = {
      ...this.newOrder,
      image_url: this.uploadedImageUrl || null,
      price: this.priceEstimate,
      id_client: 3,
    } as CustomOrder;

    this.customOrdersService.crearCustomOrder(order).subscribe({
      next: (createdOrder) => {
        this.selectedAccessories.forEach((idAcc) => {
          this.orderAccessoriesService.crearOrderAccessory({
            id_order: createdOrder.id_order!,
            id_accessory: idAcc,
          }).subscribe();
        });

        this.cartItemsService.createCartItem({
          cartid: 1,
          productid: 5,
          quantity: 1,
          price: this.priceEstimate,
        }).subscribe();

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

  resetForm(): void {
    this.newOrder = { id_client: 1, description: '', delivery_date: new Date(), size: 1 };
    this.uploadedImageUrl = null;
    this.selectedAccessories = [];
    this.priceEstimate = 0;
  }
}
