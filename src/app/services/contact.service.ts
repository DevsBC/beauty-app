import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Message } from '../schema.database';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  collectionName = 'messages';
  constructor(private db: DatabaseService) { }

  setMessage(message: Message) {
    return this.db.setDocument(this.collectionName, message);
  }
}