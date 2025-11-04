// catalog.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../../services/product';
import { CartItemsService } from '../../services/cart-item';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog-product.scss']
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
    this.productsSvc.getProducts().subscribe(products => {
      this.products = products || [];
      // sacar categorias únicas de los productos
      const cats = new Set<string>();
      this.products.forEach(p => { if (p.category) cats.add(p.category); });
      this.categories = Array.from(cats).sort();
      this.applyFilters(); 
      this.loading = false;
    }, _err => { this.loading = false; });
  }

  applyFilters() {
    if (this.selectedCategory === 'all') {
      this.filtered = [...this.products];
    } else {
      this.filtered = this.products.filter(p => p.category === this.selectedCategory);
    }
    // total pages (cálculo seguro dígito por dígito)
    const len = this.filtered.length;
    const ps = this.pageSize;
    const div = Math.floor(len / ps);
    const rem = len - (div * ps);
    this.totalPages = (rem > 0) ? div + 1 : (div === 0 ? 1 : div);
    this.currentPage = 1;
    this.updateDisplayed();
  }

  updateDisplayed() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedProducts = this.filtered.slice(start, end);
    // defender contra páginas inválidas:
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
    // Navega pasando el id para que product page lo pueda consultar
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

  this.cartSvc.getCartItems().subscribe(items => {
    const exist = items.find(i => i.productid === product.id_product && i.cartid === cartId);

    if (exist && exist.id) {
      const newQty = exist.quantity + qty;
      this.cartSvc.updateCartItem(exist.id, { quantity: newQty })
        .subscribe({
          next: _ => this.addingToCartId = null,
          error: _ => this.addingToCartId = null
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
  }, _ => this.addingToCartId = null);
}
}
