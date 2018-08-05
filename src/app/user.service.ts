import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private logged = false;
  private accessToken = '';
  private idToken = '';
  private email = '';
  tagId = '';
  slots: Observable<any>;
  slotters = [];

  constructor(private afdb: AngularFireDatabase) {
    this.logged = localStorage.getItem('logged') === 'true';
    this.accessToken = localStorage.getItem('accessToken');
    this.idToken = localStorage.getItem('idToken');
    this.email = localStorage.getItem('email');
    this.getTagId();
    this.getSlots();
  }

  isLogged() {
    return this.logged;
  }

  getEmail() {
    return this.email;
  }

  getAccessToken() {
    return this.logged;
  }

  getIdToken() {
    return this.idToken;
  }

  setLogged() {
    this.logged = true;
  }

  setLogOut() {
    this.logged = false;
  }

  getTagId() {
    this.afdb.list('user/' + encodeURIComponent(this.getEmail()).replace('.', '%2E')).valueChanges().subscribe(user => {
      console.log('fetched tagID' + user[1]);
      this.tagId = user[1].toString();
    });
  }

  getSlots() {
    this.slots = this.afdb.list('slot/').valueChanges();
    this.slots.subscribe(item => {
      console.log(item);
      this.slotters = item;
      console.log(this.slotters[0]['tagId']);
    });
  }
}
