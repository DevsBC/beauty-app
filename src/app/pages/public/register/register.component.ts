import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  togglePasswordVisibility() {
    var passwordField = document.getElementById('password') as any;
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
  }
}
