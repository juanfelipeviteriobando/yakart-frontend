import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ProductsService, Product } from '../../services/product';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ToastModule,
    FileUploadModule,
    HttpClientModule,
  ],
  providers: [MessageService],
  templateUrl: './menu-products.html',
  styleUrl: './menu-products.scss',
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private http = inject(HttpClient);

  /** URL del endpoint de subida de imágenes */
  uploadApiUrl = 'http://localhost:3000/upload';

  products: Product[] = [];
  productDialog = false;
  editMode = false;
  uploadedImageUrl: string | null = null;

  selectedProduct: Product = {
    name: '',
    description: '',
    price: 0,
    size: 0,
    stock: 0,
    category: '',
  };

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    if (role !== 'admin') {
      this.router.navigate(['/']);
      return;
    }
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar productos',
        }),
    });
  }

  openNew() {
    this.editMode = false;
    this.selectedProduct = {
      name: '',
      description: '',
      price: 0,
      size: 0,
      stock: 0,
      category: '',
    };
    this.uploadedImageUrl = null;
    this.productDialog = true;
  }

  editProduct(product: Product) {
    this.editMode = true;
    this.selectedProduct = { ...product };
    this.uploadedImageUrl = product.image_url || null;
    this.productDialog = true;
  }

  deleteProduct(id: number) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Producto eliminado',
          });
          this.loadProducts();
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el producto',
          }),
      });
    }
  }

  hideDialog() {
    this.productDialog = false;
  }

  /** 🔹 Subida real al backend NestJS (con autorización JWT) */
  uploadImage(event: any): void {
    const file = event.files[0];
    if (!file) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No autenticado',
        detail: 'Por favor, inicia sesión para subir imágenes.',
      });
      this.router.navigate(['/auth/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ imageUrl: string }>(this.uploadApiUrl, formData, { headers }).subscribe({
      next: (res) => {
        this.uploadedImageUrl = res.imageUrl;
        this.selectedProduct.image_url = res.imageUrl;
        this.messageService.add({
          severity: 'success',
          summary: 'Imagen subida',
          detail: 'La imagen se subió correctamente.',
        });
      },
      error: (err) => {
        console.error('Error subiendo imagen:', err);
        if (err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'No autorizado',
            detail: 'Tu sesión expiró o no tienes permiso.',
          });
          this.router.navigate(['/auth/login']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo subir la imagen.',
          });
        }
      },
    });
  }

  saveProduct() {
    if (!this.selectedProduct.name || !this.selectedProduct.price || !this.selectedProduct.category) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Completa todos los campos obligatorios',
      });
      return;
    }

    if (this.uploadedImageUrl) {
      this.selectedProduct.image_url = this.uploadedImageUrl;
    }

    const request$ = this.editMode
      ? this.productService.updateProduct(this.selectedProduct.id_product!, this.selectedProduct)
      : this.productService.createProduct(this.selectedProduct);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.editMode ? 'Actualizado' : 'Creado',
          detail: this.editMode ? 'Producto actualizado' : 'Producto añadido',
        });
        this.productDialog = false;
        this.loadProducts();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el producto',
        }),
    });
  }
}
