// product.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../../services/product';
import { CartItemsService } from '../../services/cart-item';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
    const id = idParam ? parseInt(idParam, 10) : null;
    if (!id) {
      // id inválido, volver al catálogo
      this.router.navigate(['/']);
      return;
    }
    this.loading = true;
    this.productsSvc.getProductById(id).subscribe(prod => {
      this.product = prod;
      this.loading = false;
    }, _ => {
      this.loading = false;
      // en caso de error también volver al catálogo
      this.router.navigate(['/']);
    });
  }

  inc() { if (this.product && this.qty < (this.product.stock || 9999)) this.qty++; }
  dec() { if (this.qty > 1) this.qty--; }

  addToCart() {
  if (!this.product || this.product.id_product == null) {
    console.error('No se puede agregar: producto no cargado o id inválido');
    return;
  }

  this.adding = true;
  const cartId = 1;

  this.cartSvc.getCartItems().subscribe(items => {
    const exist = items.find(i => i.productid === this.product!.id_product && i.cartid === cartId);

    if (exist && exist.id) {
      const newQty = exist.quantity + this.qty;
      this.cartSvc.updateCartItem(exist.id, { quantity: newQty })
        .subscribe({
          next: _ => this.adding = false,
          error: _ => this.adding = false
        });
    } else {
      const productid = this.product?.id_product;
if (productid == null) {
  console.error('No se puede agregar al carrito: id de producto inválido.');
  this.adding = false;
  return;
}

const payload = {
  cartid: 1,
  productid,        // 🔥 ya garantizado que no es undefined
  quantity: this.qty,
  price: this.product!.price
};

this.cartSvc.createCartItem(payload).subscribe(
  _ => this.adding = false,
  _ => this.adding = false
);

    }
  }, _ => this.adding = false);
}

}
