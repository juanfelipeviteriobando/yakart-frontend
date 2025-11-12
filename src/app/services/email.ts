import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  sendEmail(data: any) {
    const serviceID = 'service_test';      // <-- crea en emailjs.com
    const templateID = 'template_test';    // <-- tu template de prueba
    const publicKey = 'YOUR_PUBLIC_KEY';   // <-- reemplaza por tu clave pública

    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
      to_email: 'juanfelipeviterimax@gmail.com',
    };

    return from(emailjs.send(serviceID, templateID, templateParams, publicKey));
  }
}
