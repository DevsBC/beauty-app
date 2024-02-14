import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { User } from '../schema.database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: DatabaseService) { }

  getUsers() {
    return this.db.getSnapshot('users') as Observable<User[]>;
  }

  async setUser(data: User, hash = true, edit = false) {
    if (!edit) {
      const user = await this.getUser(data.username);
      if (user) {
        throw new Error('User already exists');
      }
    }

    if (hash) {
      data.password = btoa(data.password!);
    }
    const user = await this.db.setDocument('users', data);
    return user;
  }

  deleteUser(user: User) {
    return this.db.deleteDocument('users', user);
  }

  private async getUser(username: string) {
    const users: User[] = await this.db.getCollection('users', { property: 'username', condition: '==', value: username });
    return users[0];
  }
}
