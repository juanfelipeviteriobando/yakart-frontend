import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RippleModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  success: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.loading = false;
        this.success =
          'Hemos enviado un correo con instrucciones para recuperar tu contraseña.';
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message || 'No se pudo enviar el correo.';
      },
    });
  }
  login(){
  this.router.navigate(['/auth/login'])
  }
}
