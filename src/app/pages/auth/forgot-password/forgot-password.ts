import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // <-- IMPORTAR RouterModule
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  standalone: true, // 👈 es standalone
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,       // 👈 necesario para [routerLink]
    InputTextModule,
    ButtonModule,
    RippleModule
  ],
})
export class ForgotPasswordComponent {
  email = '';
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService) {}

  sendRecoveryEmail(): void {
    if (!this.email) {
      this.errorMessage = 'Por favor ingresa tu correo electrónico';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.successMessage = 'Se ha enviado un correo con instrucciones para restablecer tu contraseña';
        this.loading = false;
      },
      error: err => {
        this.errorMessage = err.message || 'Ocurrió un error al enviar el correo';
        this.loading = false;
      }
    });
  }
}
