import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

import { ProductsService, Product } from '../../services/product';
import { CartItemsService, CartItem } from '../../services/cart-item';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    FormsModule,
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class CartComponent implements OnInit {
  cartItems: (CartItem & { product?: Product })[] = [];
  total = 0;
  loading = true;

  constructor(
    private cartService: CartItemsService,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  /** 🔹 Cargar los ítems del carrito con sus productos asociados */
  loadCart() {
    this.loading = true;
    this.cartService
      .getCartItems()
      .pipe(
        switchMap((items) => {
          if (items.length === 0) {
            this.cartItems = [];
            this.total = 0;
            return of([]); // no hay productos
          }
console.log('🧾 Items recibidos del backend:', items);

          const productCalls = items.map((item) => {
  const productId = item.product?.id_product ?? item.productid;
  if (!productId) return of(undefined);

  return this.productService.getProductById(productId).pipe(
    catchError((err) => {
      console.error('Error cargando producto:', productId, err);
      return of(undefined);
    })
  );
});


          return forkJoin(productCalls).pipe(
            switchMap((products) => {
              this.cartItems = items.map((item, i) => ({
                ...item,
                product: products[i],
              }));
              this.calculateTotal();
              return of(this.cartItems);
            })
          );
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        error: (err) => console.error('Error cargando carrito:', err),
      });
  }

  /** 🔹 Recalcular total general */
  calculateTotal() {
    this.total = this.cartItems.reduce(
      (acc, item) => acc + item.quantity * (item.product?.price || 0),
      0
    );
  }

  /** 🔹 Actualizar cantidad y sincronizar con API */
  updateQuantity(item: CartItem & { product?: Product }, quantity: number) {
    if (quantity < 1) return;

    const oldQuantity = item.quantity;
    item.quantity = quantity;
    this.calculateTotal();

    this.cartService.updateCartItem(item.id!, { quantity }).pipe(
      catchError((err) => {
        console.error('Error al actualizar cantidad:', err);
        item.quantity = oldQuantity; // revertir en caso de error
        this.calculateTotal();
        return of(null);
      })
    ).subscribe();
  }

  /** 🔹 Eliminar un ítem del carrito */
  deleteItem(item: CartItem) {
    this.cartService.deleteCartItem(item.id!).pipe(
      catchError((err) => {
        console.error('Error al eliminar ítem:', err);
        return of(null);
      })
    ).subscribe(() => {
      this.cartItems = this.cartItems.filter((c) => c.id !== item.id);
      this.calculateTotal();
    });
  }

  /** 🔹 Vaciar carrito completo */
  clearCart() {
    if (this.cartItems.length === 0) return;

    const deleteCalls = this.cartItems.map((item) =>
      this.cartService.deleteCartItem(item.id!).pipe(catchError(() => of(null)))
    );

    forkJoin(deleteCalls).subscribe(() => {
      this.cartItems = [];
      this.total = 0;
    });
  }

  /** 🔹 Acción al presionar “Pagar” */
  pagar() {
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío 🛒');
      return;
    }

    alert(
      `✅ Se procesará el pago de ${this.total.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
      })}`
    );

    // Ejemplo: podrías redirigir a checkout o crear una orden en el backend
    // this.router.navigate(['/checkout']);
  }
}
