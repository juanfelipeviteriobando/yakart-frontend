import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService, Product } from '../../services/product';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.scss']
})
export class SearchComponent {
  private productService = inject(ProductsService);
  private router = inject(Router);

  searchTerm: string = '';
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      this.filteredProducts = products;
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.allProducts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  // 🔥 Nuevo: abrir producto
  goToProduct(product: Product) {
    if (!product?.id_product) return;
    this.router.navigate(['/product', product.id_product]);
  }
}
