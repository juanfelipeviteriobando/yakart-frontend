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
import { AccessoriesService, Accessory } from '../../services/accessories';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-accessories',
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
  templateUrl: './menu-accesories.html',
  styleUrls: ['./menu-accesories.scss'],
})
export class AdminAccessoriesComponent implements OnInit {
  private accessoryService = inject(AccessoriesService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private http = inject(HttpClient);

  uploadApiUrl = 'http://localhost:3000/upload';

  accessories: Accessory[] = [];
  accessoryDialog = false;
  editMode = false;
  uploadedImageUrl: string | null = null;

  // 🔹 Usamos Partial<Accessory> para que 'id' sea opcional dentro del componente
  selectedAccessory: Partial<Accessory> = { name: '', price: 0 };

  ngOnInit(): void {
    if (this.authService.getUserRole() !== 'admin') {
      this.router.navigate(['/']);
      return;
    }
    this.loadAccessories();
  }

  loadAccessories() {
    this.accessoryService.getAccessories().subscribe({
      next: (data) => (this.accessories = data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar accesorios',
        }),
    });
  }

  openNew() {
    this.editMode = false;
    this.selectedAccessory = { name: '', price: 0 }; // id opcional
    this.uploadedImageUrl = null;
    this.accessoryDialog = true;
  }

  editAccessory(accessory: Accessory) {
    this.editMode = true;
    this.selectedAccessory = { ...accessory };
    this.uploadedImageUrl = accessory.imageUrl || null;
    this.accessoryDialog = true;
  }

  deleteAccessory(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este accesorio?')) return;
    this.accessoryService.deleteAccessory(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Accesorio eliminado' });
        this.loadAccessories();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el accesorio' }),
    });
  }

  hideDialog() {
    this.accessoryDialog = false;
  }

  uploadImage(event: any) {
    const file = event.files[0];
    if (!file) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      this.messageService.add({ severity: 'warn', summary: 'No autenticado', detail: 'Inicia sesión para subir imágenes.' });
      this.router.navigate(['/auth/login']);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ imageUrl: string }>(this.uploadApiUrl, formData, { headers }).subscribe({
      next: (res) => {
        this.uploadedImageUrl = res.imageUrl;
        this.selectedAccessory.imageUrl = res.imageUrl;
        this.messageService.add({ severity: 'success', summary: 'Imagen subida', detail: 'Imagen subida correctamente.' });
      },
      error: (err) => {
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'No autorizado', detail: 'Tu sesión expiró.' });
          this.router.navigate(['/auth/login']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo subir la imagen.' });
        }
      },
    });
  }

  saveAccessory() {
    if (!this.selectedAccessory.name || !this.selectedAccessory.price) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Completa los campos obligatorios' });
      return;
    }

    if (this.uploadedImageUrl) this.selectedAccessory.imageUrl = this.uploadedImageUrl;

    const request$ = this.editMode
      ? this.accessoryService.updateAccessory(this.selectedAccessory.id!, this.selectedAccessory)
      : this.accessoryService.createAccessory(this.selectedAccessory);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.editMode ? 'Actualizado' : 'Creado',
          detail: this.editMode ? 'Accesorio actualizado' : 'Accesorio añadido',
        });
        this.accessoryDialog = false;
        this.loadAccessories();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el accesorio' }),
    });
  }
}
