// src/app/pages/clientes/list/list.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService, Cliente } from '../../../services/clientes';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class ClientesListComponent implements OnInit {
  private clientesService = inject(ClientesService);
  private fb = inject(FormBuilder);

  clientes: Cliente[] = [];
  clienteForm!: FormGroup;
  cargando = false;
  error = '';

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      direction: ['']
    });
    this.cargarClientes();
  }

  cargarClientes() {
    this.cargando = true;
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar los clientes';
        this.cargando = false;
      }
    });
  }

  crearCliente() {
    if (this.clienteForm.invalid) return;
    const nuevo = this.clienteForm.value;

    this.clientesService.crearCliente(nuevo).subscribe({
      next: () => {
        alert('Cliente creado');
        this.clienteForm.reset();
        this.cargarClientes();
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear cliente');
      }
    });
  }

  eliminarCliente(id: number) {
    if (!confirm('¿Eliminar cliente?')) return;
    this.clientesService.eliminarCliente(id).subscribe({
      next: () => this.cargarClientes(),
      error: (err) => console.error(err)
    });
  }
}
