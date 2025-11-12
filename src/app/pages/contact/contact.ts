import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../services/email';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 AQUI VA LA SOLUCIÓN
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(private emailService: EmailService) {}

  sendEmail() {
    this.emailService.sendEmail(this.form).subscribe({
      next: () => alert('✅ ¡Correo enviado con éxito!'),
      error: () => alert('❌ Error al enviar el correo.')
    });
  }
}
