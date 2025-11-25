import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsService, Product } from '../../services/product';
import { CustomOrdersService, CustomOrder } from '../../services/custom-orders';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  private productsService = inject(ProductsService);
  private customOrdersService = inject(CustomOrdersService);
  private router = inject(Router);

  productos: Product[] = [];
  otrosProductos: Product[] = [];
  customOrders: CustomOrder[] = [];

  // Opciones responsive para todos los carouseles
  carouselResponsiveOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 3 },
    { breakpoint: '768px', numVisible: 2, numScroll: 2 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCustomOrders();
  }

  private cargarProductos(): void {
    this.productsService.getProducts().subscribe({
      next: (productos) => {
        const shuffled = this.shuffleArray(productos);
        this.productos = shuffled.slice(0, 3);
        this.otrosProductos = shuffled.slice(0, 17);
      },
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  private cargarCustomOrders(): void {
    this.customOrdersService.getCustomOrders().subscribe({
      next: (orders) => {
        this.customOrders = this.shuffleArray(orders).slice(0, 17);
      },
      error: (err) => console.error('Error cargando custom orders', err)
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array.map(x => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map(a => a.x);
  }

  irACustomOrders(): void { this.router.navigate(['/customorders']); }
  irACatalogo(): void { this.router.navigate(['/catalog']); }
  irAProducto(id: number): void { this.router.navigate([`/product/${id}`]); }
}
