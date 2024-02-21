import { Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Message } from '../../schema.database';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  year = new Date().getFullYear();
  message = {} as Message;
  error = '';
  constructor(private contactService: ContactService) {}

  async send() {
    if (this.validateForm()) {
      await this.contactService.setMessage(this.message);
      this.showAlert({ title: 'Mensaje Enviado', icon: 'success' });
      this.message = {} as Message;
    }
  }

  private validateForm() {
    // Get form inputs
    const name = (this.message.name || '').trim();
    const email = (this.message.email || '').trim();
    const content = (this.message.content || '').trim();
  
    // Validate name (required, length > 2)
    if (name.length === 0 || name.length <= 2) {
      this.error = 'Por favor, ingrese un nombre válido (longitud mínima: 3 caracteres).'
      return false;
    }
  
    // Validate email (isEmail)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.error = 'Por favor, ingrese una dirección de correo electrónico válida.';
      return false;
    }
  
    // Validate content (length > 5)
    if (content.length <= 5) {
      this.error = 'Por favor, ingrese un mensaje con al menos 6 caracteres.';
      return false;
    }
    this.error = '';
    this.message = { name, email, content };
    // If all validations pass, the form is considered valid
    return true;
  }

  private showAlert(params: any) {
    return (window as any).Swal.fire(params)as any;
  }
}
