import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    CommonModule,
    AppFloatingConfigurator,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  checked = false;
  errorMessage = '';
  returnUrl = '/'; // Ruta por defecto si no hay una bloqueada

  private apiUrl = 'http://localhost:3000/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // 🔹 Captura la ruta bloqueada a la que intentaba acceder el usuario
    this.route.queryParams.subscribe((params) => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  login() {
    const credentials = { email: this.email, password: this.password };

    this.http.post<any>(this.apiUrl, credentials).subscribe({
      next: (response) => {
        if (response?.access_token) {
          // ✅ Guarda la sesión
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('userEmail', response.email);
          localStorage.setItem('userRole', response.rol);

          // 🔁 Redirige a la ventana que bloqueó
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.errorMessage = 'No se recibió el token del servidor.';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Credenciales incorrectas.';
      },
    });
  }
}
