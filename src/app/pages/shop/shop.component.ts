import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface CartItem {
  id_product: number;
  name: string;
  unit_price: number;
  quantity: number;
  image?: string;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ShopComponent implements OnInit {
  private API_BASE = 'http://localhost:3000';

  ENDPOINTS = {
    products: `${this.API_BASE}/products`,
    clients: `${this.API_BASE}/clientes`,
    sales: `${this.API_BASE}/sales`,
    saleDetails: `${this.API_BASE}/sale-details`,
    customOrders: `${this.API_BASE}/custom-orders`,
    accessories: `${this.API_BASE}/accessory`,
    orderAccessories: `${this.API_BASE}/order-accessories`,
  };

  activePanel: 'products' | 'clients' | 'orders' | 'accessories' | 'cart' = 'products';
  products: any[] = [];
  filteredProducts: any[] = [];
  clients: any[] = [];
  customOrders: any[] = [];
  accessories: any[] = [];

  searchQ = '';
  filterCategory = '';

  CART: CartItem[] = [];
  cartCount = 0;
  checkoutClientId?: number;
  checkoutMsg = '';

  clientForm: any = {};
  customOrderForm: any = {};
  accessoryForm: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.showPanel('products');
    this.loadProducts();
  }

  // Cambiar panel y cargar datos
  showPanel(panel: any) {
    this.activePanel = panel;
    if (panel === 'clients') this.loadClients();
    if (panel === 'orders') this.loadCustomOrders();
    if (panel === 'accessories') this.loadAccessories();
    if (panel === 'cart') this.renderCart();
  }

  // ---------- Productos ----------
  async loadProducts() {
    this.products = [];
    this.filteredProducts = [];
    try {
      const res: any = await this.http.get(this.ENDPOINTS.products).toPromise();
      this.products = Array.isArray(res) ? res : res ? [res] : [];
    } catch (err) {
      console.error('Products fetch failed', err);
      this.products = [];
    }
    this.applyFilters();
  }

  applyFilters() {
    let res = [...this.products];
    if (this.filterCategory) res = res.filter(p => p.category === this.filterCategory);
    if (this.searchQ && this.searchQ.trim()) {
      const q = this.searchQ.toLowerCase();
      res = res.filter(p =>
        (p.name || p.nombre || '').toString().toLowerCase().includes(q) ||
        (p.description || '').toString().toLowerCase().includes(q)
      );
    }
    this.filteredProducts = res;
  }

  categoriesList(): string[] {
    return Array.from(new Set(this.products.map(p => p.category).filter(Boolean)));
  }

  productImage(p: any){ return p.image_url || p.imagen_url || 'https://via.placeholder.com/160x120/ffedf6/ff77b0?text=Y'; }
  productName(p: any){ return p.name || p.nombre || 'Product'; }
  productPrice(p: any){ return Number(p.price ?? p.precio ?? 0).toFixed(2); }
  productStock(p: any){ return p.stock ?? '-'; }

  // ---------- Carrito ----------
  addToCart(product: any) {
    const pid = Number(product.id_product ?? product.id ?? product.idProduct);
    const existing = this.CART.find(i => i.id_product === pid);
    const name = product.name || product.nombre || 'Product';
    const unit_price = Number(product.price ?? product.precio ?? 0);
    const image = product.image_url || product.imagen_url || undefined;
    if (existing) existing.quantity++;
    else this.CART.push({ id_product: pid, name, unit_price, quantity: 1, image });
    this.updateCartUI();
  }

  updateCartUI() {
    this.cartCount = this.CART.reduce((s, i) => s + i.quantity, 0);
    this.renderCart();
  }

  renderCart() { /* se muestra directamente con *ngFor */ }

  changeCartQuantity(idx: number, delta: number) {
    const it = this.CART[idx];
    if (!it) return;
    it.quantity = Math.max(1, it.quantity + delta);
    this.updateCartUI();
  }

  removeCartItem(idx: number) { this.CART.splice(idx, 1); this.updateCartUI(); }
  clearCart() { this.CART = []; this.updateCartUI(); }

  async checkout() {
    this.checkoutMsg = '';
    const clientId = Number(this.checkoutClientId);
    if (!clientId) { this.checkoutMsg = 'Enter client id (id_cliente) before checkout'; return; }
    if (this.CART.length === 0) { this.checkoutMsg = 'Cart is empty'; return; }

    try {
      const sale: any = await this.http.post(this.ENDPOINTS.sales, { id_client: clientId, sale_date: new Date().toISOString().slice(0,10), total: 0 }).toPromise();
      const saleId = sale.id_sale ?? sale.id ?? sale.idSale;
      if (!saleId) throw new Error('Could not read sale id from response');

      for (const item of this.CART) {
        await this.http.post(this.ENDPOINTS.saleDetails, {
          id_sale: saleId,
          id_product: item.id_product,
          quantity: item.quantity,
          unit_price: item.unit_price
        }).toPromise();
      }

      const finalSale: any = await this.http.get(`${this.ENDPOINTS.sales}/${saleId}`).toPromise();
      this.checkoutMsg = `Order created! sale id ${saleId}. Total: $${Number(finalSale.total || 0).toFixed(2)}`;
      this.CART = [];
      this.updateCartUI();
    } catch (err: any) {
      console.error(err);
      this.checkoutMsg = 'Checkout error: ' + (err.message || err);
    }
  }

  // ---------- Clientes ----------
  async loadClients() {
    try {
      const res: any = await this.http.get(this.ENDPOINTS.clients).toPromise();
      this.clients = Array.isArray(res) ? res : res ? [res] : [];
    } catch (err) {
      console.error('Load clients failed', err);
      this.clients = [];
    }
  }

  async submitClient(form: NgForm) {
    if (!form.valid) return alert('Formulario inválido');
    try {
      await this.http.post(this.ENDPOINTS.clients, this.clientForm, { headers: new HttpHeaders({'Content-Type':'application/json'}) }).toPromise();
      form.resetForm();
      this.clientForm = {};
      await this.loadClients();
      alert('Client created');
    } catch (err: any) {
      console.error(err);
      alert('Client create failed: ' + (err.message || err));
    }
  }

  // ---------- Pedidos Personalizados ----------
  async submitCustomOrder(form: NgForm) {
    if (!form.valid) return alert('Formulario inválido');
    try {
      await this.http.post(this.ENDPOINTS.customOrders, this.customOrderForm, { headers: new HttpHeaders({'Content-Type':'application/json'}) }).toPromise();
      form.resetForm();
      this.customOrderForm = {};
      await this.loadCustomOrders();
      alert('Custom order created');
    } catch (err: any) {
      console.error(err);
      alert('Custom order error: ' + (err.message || err));
    }
  }

  async loadCustomOrders() {
    try {
      const res: any = await this.http.get(this.ENDPOINTS.customOrders).toPromise();
      const data = Array.isArray(res) ? res : res ? [res] : [];
      this.customOrders = data.slice().reverse();
    } catch (err) {
      console.error('loadCustomOrders', err);
      this.customOrders = [];
    }
  }

  // ---------- Accesorios ----------
  async submitAccessory(form: NgForm) {
    if (!form.valid) return alert('Formulario inválido');
    try {
      const dto = { ...this.accessoryForm, available: !!this.accessoryForm.available };
      await this.http.post(this.ENDPOINTS.accessories, dto, { headers: new HttpHeaders({'Content-Type':'application/json'}) }).toPromise();
      form.resetForm();
      this.accessoryForm = {};
      await this.loadAccessories();
      alert('Accessory created');
    } catch (err: any) {
      console.error(err);
      alert('Accessory create error: ' + (err.message || err));
    }
  }

  async loadAccessories() {
    try {
      const res: any = await this.http.get(this.ENDPOINTS.accessories).toPromise();
      this.accessories = Array.isArray(res) ? res : res ? [res] : [];
    } catch (err) {
      console.error('loadAccessories', err);
      this.accessories = [];
    }
  }

  async associateAccessoryPrompt(accessoryId: number) {
    const id_order = prompt('Enter Custom Order ID (id_order) to attach accessory:');
    if (!id_order) return alert('Order id required');
    try {
      await this.http.post(this.ENDPOINTS.orderAccessories, { id_order: Number(id_order), id_accessory: accessoryId }, { headers: new HttpHeaders({'Content-Type':'application/json'}) }).toPromise();
      alert('Accessory associated to order');
      this.loadCustomOrders();
    } catch (err: any) {
      console.error(err);
      alert('Associate error: ' + (err.message || err));
    }
  }
}
