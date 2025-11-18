import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth'; // Ajusta ruta
import { ClientesService, Cliente } from '../../services/clientes'; // Ajusta ruta

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {

  auth = inject(AuthService);
  clientesService = inject(ClientesService);

  cliente!: Cliente;
  cargando = true;
  editMode = false;
  mensaje = '';

  ngOnInit(): void {
    this.cargarPerfil();
  }

  // ------------------------------------------
  // 📌 CARGAR PERFIL DESDE BACKEND
  // ------------------------------------------
  cargarPerfil() {
    const email = this.auth.getUserEmail();
    if (!email) return;

    this.clientesService.getClientes().subscribe({
      next: (clientes) => {
        const encontrado = clientes.find(c => c.email === email);

        if (encontrado) {
          this.cliente = { ...encontrado };
        } else {
          // si no existe, crear el cliente automáticamente
          this.clientesService.crearCliente({
            name: email.split('@')[0],
            email,
            phone: '',
            direction: ''
          }).subscribe(nuevo => {
            this.cliente = nuevo;
          });
        }

        this.cargando = false;
      },
      error: () => {
        this.mensaje = 'Error al cargar la información.';
        this.cargando = false;
      }
    });
  }

  // ------------------------------------------
  // 📌 Activar edición
  // ------------------------------------------
  activarEdicion() {
    this.editMode = true;
    this.mensaje = '';
  }

  cancelarEdicion() {
    this.editMode = false;
    this.mensaje = '';
  }

  // ------------------------------------------
  // 📌 GUARDAR CAMBIOS
  // ------------------------------------------
  guardarCambios() {
    if (!this.cliente.id_client) {
      this.mensaje = 'No se puede actualizar: cliente sin ID.';
      return;
    }

    this.clientesService.actualizarCliente(this.cliente.id_client, {
      name: this.cliente.name,
      phone: this.cliente.phone,
      direction: this.cliente.direction
    }).subscribe({
      next: res => {
        this.cliente = res;
        this.mensaje = 'Cambios guardados correctamente.';
        this.editMode = false;
      },
      error: () => this.mensaje = 'Error al guardar cambios.'
    });
  }

  logout() {
    this.auth.logout();
  }
}
