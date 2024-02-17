import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { Firestore, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, limitToLast, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { collection } from "firebase/firestore"; 
import {  v4 as uuidv4 } from 'uuid';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
interface IQuery {
  property: string;
  condition:
    | '<'
    | '<='
    | '=='
    | '>'
    | '>='
    | '!='
    | 'array-contains'
    | 'array-contains-any'
    | 'in'
    | 'not-in';
  value: any;
}

interface ILimit {
  max: number;
  by: string;
  direction: 'asc' | 'desc'
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  db: Firestore;
  baseCollection;
  private context;
  constructor() { 
    const app = initializeApp(environment.config);
    this.db = getFirestore(app);
    this.context = localStorage.getItem('context') || environment.context;
    this.baseCollection = `beauty-app/${this.context}`;
    console.log(this.baseCollection)
  }

  public getPath(path: string) {
    return `${this.baseCollection}/${path}`;
  }

  public async setDocument(collectionName: string, data: any, update = true) {
    if (!data.id) {
      data.id = uuidv4();
      data.creationDate = new Date();
      data.context = this.context;
    }
    if (update) {
      data.updateDate = new Date();
    }
    const reference = doc(this.db, 'beauty-app', this.context, collectionName, data.id);
    await setDoc(reference, data, { merge: true });

    this.set(collectionName, data);    
    return data;
  }

  public async getDocument(collectionName: string, id: string) {
    collectionName = this.getPath(collectionName);
    const docSnap = await getDoc(doc(this.db, collectionName, id));
    return docSnap.data();
  }

  public async deleteDocument(collectionName: string, document: any, backup = true) {
    const path = this.getPath(collectionName);
    await deleteDoc(doc(this.db, path, document.id));

    if (backup) {
      const reference = doc(this.db, 'beauty-app', this.context, '_' + collectionName, document.id);
      await setDoc(reference, document, { merge: true });
    }

    this.set(collectionName, document, true);

  }

  public async deleteDoc(collectionName: string, id: string) {
    const path = this.getPath(collectionName);
    await deleteDoc(doc(this.db, path, id));
  }

  public async getCollection(collectionName: string, customQuery?: IQuery, limitQuery?: ILimit) {
    const path = this.getPath(collectionName);
    let request;
    const data: any[] = [];
    if (customQuery) {
      if (limitQuery) {
        request = query(collection(this.db, path), 
          where(customQuery.property, customQuery.condition, customQuery.value), 
          orderBy(limitQuery.by), limit(limitQuery.max));
      } else {
        request = query(collection(this.db, path), where(customQuery.property, customQuery.condition, customQuery.value));
      }
    } else {
      if (limitQuery) {
        request = query(collection(this.db, path), orderBy(limitQuery.by, limitQuery.direction), limit(limitQuery.max));
      } else {
        request = collection(this.db, path);
      }
    }

    const querySnapshot = await getDocs(request as any);
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  }

  public getSnapshot(collectionName: string) {
    const path = this.getPath(collectionName);
    return new Observable(observer => {
      return onSnapshot(collection(this.db, path),
        (snapshot => {
          const data: any[] = [];
          snapshot.docs.forEach(d => data.push(d.data()));
          observer.next(data);
        }),
        (error => observer.error(error.message))
      );
    });
  }


  private set(collectionName: string, data: any, remove = false) {
    const isArray = Array.isArray(data);
    let collection = isArray ? data : [data];
    if (sessionStorage.getItem(collectionName)) {
      if(!isArray) {
        collection = JSON.parse(sessionStorage.getItem(collectionName)!) as any[];
        const index = collection.findIndex(c => c.id === data.id);
        if (index > -1) {
          if (remove) {
            collection.splice(index, 1);
          } else {
            collection[index] = { ...collection[index], ...data};
          }
        } else {
          collection.push(data);
        }
      } 
    }
    if (collection.length > 0) {
      sessionStorage.setItem(collectionName, JSON.stringify(collection));
    } else {
      sessionStorage.removeItem(collectionName);
    }
  }

  private get(collectionName: string, id?: string) {
    if (sessionStorage.getItem(collectionName)) {
      const collection = JSON.parse(sessionStorage.getItem(collectionName)!) as any[];
      if (id) {
        return collection.find(c => c.id === id);
      } else {
        return collection;
      }
    } else {
      return null;
    }
  }
  
}

