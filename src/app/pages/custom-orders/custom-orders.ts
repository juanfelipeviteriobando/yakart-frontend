/* eslint-disable prettier/prettier */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpClientModule,HttpHeaders } from '@angular/common/http';
import { CustomOrdersService, CustomOrder } from '../../services/custom-orders';
import { OrderAccessoriesService } from '../../services/order-accessories';
import { AccessoriesService, Accessory } from '../../services/accessories';
import { CartItemsService } from '../../services/cart-item'; // 🛒 para añadir al carrito

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

  private uploadApiUrl = 'http://localhost:3000/upload'; // ⚙️ Endpoint del backend

  newOrder: Partial<CustomOrder> = {
    id_client: 1,
    description: '',
    delivery_date: new Date(),
    size: 1,
  };

  // 🔹 Cambiar fecha
  onDeliveryDateChange(event: any) {
    const value = event.target.value;
    this.newOrder.delivery_date = value ? new Date(value) : new Date();
  }

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

  /** 🔹 Cargar accesorios desde la API */
  loadAccessories(): void {
    this.accessoriesService.getAccessories().subscribe({
      next: (data) => (this.accessories = data),
      error: (err) => console.error('Error cargando accesorios:', err),
    });
  }

  /** 🔹 Seleccionar o deseleccionar accesorios */
  toggleAccessory(id: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedAccessories.includes(id)) this.selectedAccessories.push(id);
    } else {
      this.selectedAccessories = this.selectedAccessories.filter((a) => a !== id);
    }
    this.calcularPrecio();
  }

  /** 🔹 Subida real al backend NestJS */
 /** 🔹 Subida real al backend NestJS (con autorización JWT) */
uploadImage(event: any): void {
  const file = event.files[0];
  if (!file) return;

  // 🔸 Obtener token JWT
  const token = localStorage.getItem('access_token');
  if (!token) {
    this.messageService.add({
      severity: 'warn',
      summary: 'No autenticado',
      detail: 'Por favor, inicia sesión para subir imágenes.',
    });
    // Si tienes Router importado (p. ej. via inject Router)
    // this.router.navigate(['/auth/login']);
    return;
  }

  // 🔸 Preparar cabeceras con autorización
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  // 🔸 Preparar archivo para envío
  const formData = new FormData();
  formData.append('file', file);

  // 🔸 Hacer petición POST al backend NestJS
  this.http.post<{ imageUrl: string }>(this.uploadApiUrl, formData, { headers }).subscribe({
    next: (res) => {
      this.uploadedImageUrl = res.imageUrl;
      this.messageService.add({
        severity: 'success',
        summary: 'Imagen subida',
        detail: 'La imagen se subió correctamente.',
      });
    },
    error: (err) => {
      console.error('Error subiendo imagen:', err);

      if (err.status === 401 || err.status === 403) {
        this.messageService.add({
          severity: 'error',
          summary: 'Sesión expirada o no autorizada',
          detail: 'Tu sesión expiró o no tienes permiso para subir imágenes.',
        });
        // this.router.navigate(['/auth/login']);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo subir la imagen. Inténtalo nuevamente.',
        });
      }
    },
  });
}


  /** 🔹 Calcular precio estimado */
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

  /** 🔹 Crear orden personalizada */
  crearOrden(): void {
    if (!this.newOrder.description) {
      alert('Debe ingresar una descripción.');
      return;
    }
    if (!this.newOrder.size) {
      alert('Debe ingresar un tamaño.');
      return;
    }
    if (!this.newOrder.delivery_date) {
      alert('Debe ingresar una fecha válida.');
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
        // 🔗 Asociar accesorios
        this.selectedAccessories.forEach((idAcc) => {
          this.orderAccessoriesService.crearOrderAccessory({
            id_order: createdOrder.id_order!,
            id_accessory: idAcc,
          }).subscribe();
        });

        // 🛒 Agregar al carrito
        this.cartItemsService
          .createCartItem({
            cartid: 1,
            productid: 5,
            quantity: 1,
            price: this.priceEstimate,
          })
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Orden agregada al carrito',
                detail: 'La orden fue añadida correctamente.',
              });
            },
            error: (err) => console.error('Error agregando al carrito:', err),
          });

        // 🔁 Actualizar lista
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
    this.newOrder = { id_client: 1, description: '', delivery_date: new Date(), size: 1 };
    this.uploadedImageUrl = null;
    this.selectedAccessories = [];
    this.priceEstimate = 0;
  }
}
