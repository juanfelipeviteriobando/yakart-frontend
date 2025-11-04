import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// 🔹 PrimeNG módulos visuales
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

import { ProductsService, Product } from '../../services/product';
import { CartItemsService } from '../../services/cart-item';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // PrimeNG visual
    ButtonModule,
    CardModule,
    InputTextModule,
    RippleModule,
  ],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog-product.scss'],
})
export class CatalogComponent implements OnInit {
  private productsSvc = inject(ProductsService);
  private cartSvc = inject(CartItemsService);
  private router = inject(Router);

  products: Product[] = [];
  filtered: Product[] = [];
  displayedProducts: Product[] = [];
  categories: string[] = [];

  selectedCategory: string = 'all';

  pageSizeOptions = [8, 16, 24, 32];
  pageSize = 16;
  currentPage = 1;
  totalPages = 1;

  loading = false;
  addingToCartId: number | null = null;

  ngOnInit(): void {
    this.loading = true;
    this.productsSvc.getProducts().subscribe({
      next: (products) => {
        this.products = products || [];

        // sacar categorías únicas de los productos
        const cats = new Set<string>();
        this.products.forEach((p) => {
          if (p.category) cats.add(p.category);
        });
        this.categories = Array.from(cats).sort();

        this.applyFilters();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  applyFilters() {
    if (this.selectedCategory === 'all') {
      this.filtered = [...this.products];
    } else {
      this.filtered = this.products.filter(
        (p) => p.category === this.selectedCategory
      );
    }

    const len = this.filtered.length;
    const ps = this.pageSize;
    const div = Math.floor(len / ps);
    const rem = len - div * ps;
    this.totalPages = rem > 0 ? div + 1 : div === 0 ? 1 : div;
    this.currentPage = 1;
    this.updateDisplayed();
  }

  updateDisplayed() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedProducts = this.filtered.slice(start, end);

    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  }

  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.applyFilters();
  }

  gotoPage(n: number) {
    if (n < 1 || n > this.totalPages) return;
    this.currentPage = n;
    this.updateDisplayed();
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayed();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayed();
    }
  }

  openProduct(product: Product) {
    if (!product?.id_product) return;
    this.router.navigate(['/product', product.id_product]);
  }

  addToCart(event: Event, product: Product, qty = 1) {
    event.stopPropagation();
    if (!product || product.id_product == null) {
      console.error('Producto inválido al intentar agregar al carrito');
      return;
    }

    this.addingToCartId = product.id_product;
    const cartId = 1;

    this.cartSvc.getCartItems().subscribe({
      next: (items) => {
        const exist = items.find(
          (i) => i.productid === product.id_product && i.cartid === cartId
        );

        if (exist && exist.id) {
          const newQty = exist.quantity + qty;
          this.cartSvc
            .updateCartItem(exist.id, { quantity: newQty })
            .subscribe({
              next: () => (this.addingToCartId = null),
              error: () => (this.addingToCartId = null),
            });
        } else {
          const productid = product?.id_product;
if (productid == null) {
  console.error('Producto inválido al intentar agregar al carrito');
  this.addingToCartId = null;
  return;
}

const payload = {
  cartid: 1,
  productid,        // 🔥 ya garantizado que no es undefined
  quantity: qty,
  price: product.price
};

this.cartSvc.createCartItem(payload).subscribe(
  _ => this.addingToCartId = null,
  _ => this.addingToCartId = null
);
        }
      },
      error: () => (this.addingToCartId = null),
    });
  }
}
