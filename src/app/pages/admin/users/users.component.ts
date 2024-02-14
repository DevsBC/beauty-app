import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AsyncPipe } from '@angular/common';
import { User } from '../../../schema.database';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RoleNamePipe } from '../../../pipes/role-name.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, FormsModule, RoleNamePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  copy: User[] = [];
  sub: Subscription;
  user = { role: 'employee' } as User;
  password = '';
  hasChanged = false;
  constructor(public userService: UserService) {
    this.sub = this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.copy = [...this.users];
    });
  }

  async ngOnInit() {
    (window as any).M.Modal.init(document.querySelector('.modal'), 
    { onCloseEnd: () => this.user = { role: 'employee' } as User });
    (window as any).M.FormSelect.init(document.querySelector('select'));
  }

  filter(event: any) {
    const term = event.target.value;
    const results = [];
    if (term && term.length > 2) {
      for (const user of this.copy) {
        for (const key of Object.keys(user)) {
          const value = user[key as keyof User];
          if (value && String(value).toLowerCase().includes(term.toLowerCase())) {
            results.push(user);
          }
        }
      } 
      this.users = [...results];
    } else {
      this.users = [...this.copy];
    }
  }

  togglePasswordVisibility() {
    var passwordField = document.getElementById('password') as any;
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
  }

  save() {
    if (!this.hasChanged) {
      console.log('nothing has changed');
      return;
    }

    const role = (document.querySelector('[name="group1"]:checked')as any).value;
    this.user.role = role;

    if (this.user.id) {
      if (this.password === btoa(this.user.password!)) {
        this.user.password = atob(this.user.password!);
      }
      this.userService.setUser(this.user, false, true);
    } else {
      if (this.user.username && this.user.password) {
        this.userService.setUser(this.user);
      }
    }
    
    this.user = { role: 'employee' } as User;
    this.password = '';
    this.hasChanged = false;
  }

  edit(user: User) {
    this.password = user.password!;
    this.user = {...user};
  }

  remove() {
    if (this.user.id) {
      this.userService.deleteUser(this.user);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
