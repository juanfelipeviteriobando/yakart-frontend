import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ProductsService, Product } from '../../services/product';
import { CartItemsService } from '../../services/cart-item';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputNumberModule,
    ImageModule,
    ProgressSpinnerModule
  ],
  templateUrl: './product.html',
  styleUrls: ['./catalog-product.scss']
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsSvc = inject(ProductsService);
  private cartSvc = inject(CartItemsService);

  product: Product | null = null;
  loading = false;
  qty = 1;
  adding = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log(idParam)
    const id = idParam ? parseInt(idParam, 10) : null;
    console.log(id)
    if (!id) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loading = true;
    this.productsSvc.getProductById(id).subscribe({
      next: prod => {
        this.product = prod;
        this.loading = false;
      },
      error: _ => {
        this.loading = false;
        this.router.navigate(['/']);
      }
    });
  }

  addToCart() {
    if (!this.product || this.product.id_product == null) {
      console.error('Producto no cargado o id inválido');
      return;
    }

    this.adding = true;
    const cartId = 1;//<--remplazar cuando este listo

    this.cartSvc.getCartItems().subscribe({
      next: items => {
        const exist = items.find(
          i => i.productid === this.product!.id_product && i.cartid === cartId
        );

        if (exist && exist.id) {
          const newQty = exist.quantity + this.qty;
          this.cartSvc.updateCartItem(exist.id, { quantity: newQty }).subscribe({
            next: () => (this.adding = false),
            error: () => (this.adding = false)
          });
        } else {
          const productid = this.product?.id_product;
if (productid == null) {
  console.error('No se puede agregar al carrito: id de producto inválido.');
  this.adding = false;
  return;
}

const payload = {
  cartid: 1,//<--remplazar cuando este listo
  productid,        // 🔥 ya garantizado que no es undefined
  quantity: this.qty,
  price: this.product!.price
};

this.cartSvc.createCartItem(payload).subscribe(
  _ => this.adding = false,
  _ => this.adding = false
);

        }
      },
      error: () => (this.adding = false)
    });
  }
}
