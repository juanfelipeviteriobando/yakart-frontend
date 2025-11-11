import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    CardModule,
    MessageModule,
    DividerModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  phone = '';
  direction = '';

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}
  login(){
  this.router.navigate(['/auth/login'])
  }
  register() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.register({
      username: this.username,
      email: this.email,
      password: this.password,
      phone: this.phone,
      direction: this.direction
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = '✅ Registro exitoso. Revisa tu correo para activar la cuenta.';
        setTimeout(() => this.router.navigate(['/auth/login']), 2500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Error durante el registro.';
      }
    });
  }
}
