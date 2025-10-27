import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.scss']
})
export class ListComponent implements OnInit {
  clientes: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }
}
