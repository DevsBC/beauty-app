import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../schema.database';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  user = {} as User;
  error = '';
  constructor(private auth: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    var passwordField = document.getElementById('password') as any;
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
  }

  async register() {
    if (this.user.username && this.user.password) {
      this.user.role = 'customer';
      try {
        await this.auth.createAccount(this.user);
        this.router.navigateByUrl('/profile');
      } catch (error: any) {
        this.error = error.message;
      }

    }
  }

}
