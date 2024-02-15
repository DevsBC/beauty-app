import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../schema.database';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user = {} as User;
  error = '';
  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    this.error = '';
    if (this.user.username && this.user.password) {
      try {
        const user = await this.auth.enterAccount(this.user);
        if (user.role) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/profile';
        }
      } catch (error: any) {
        this.error = error.message;
      }
      
    }
  }

}
