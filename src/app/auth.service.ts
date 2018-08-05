import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { BlockingProxy } from 'blocking-proxy';
import { User } from './model/userModel';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private logged = false;
  // _db: AngularFirestore();
  shirts:  Observable<any[]>;

  private list;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private afdb: AngularFireDatabase
  ) {
    this.list = this.afdb.list('/user');
  }

  isLogged() {
    return this.logged;
  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        console.log(res.credential);
        resolve(res);
        localStorage.setItem('idToken', res.credential['idToken']);
        localStorage.setItem('accessToken', res.credential['accessToken']);
        localStorage.setItem('logged', 'true');
        localStorage.setItem('email', res.user.email);
        this.addEmailToDB(res.user.email);
        this.logged = true;
        this.userService.setLogged();
        this.router.navigate(['/dashboard']);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
 }

 doGoogleLogin() {
  return new Promise<any>((resolve, reject) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    this.afAuth.auth
    .signInWithPopup(provider)
    .then(res => {
      resolve(res);
      localStorage.setItem('idToken', res.credential['idToken']);
      localStorage.setItem('accessToken', res.credential['accessToken']);
      localStorage.setItem('logged', 'true');
      localStorage.setItem('email', res.user.email);
      this.addEmailToDB(res.user.email);
      this.logged = true;
      this.userService.setLogged();
      this.router.navigate(['/dashboard']);
    });
  });
}

doRegister(value) {
  return new Promise<any>((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
    .then(res => {
      resolve(res);
    }, err => reject(err));
  });
}

addEmailToDB(email: string) {
  const users = this.afdb.list('user/' + encodeURIComponent(email).replace('.', '%2E')).valueChanges();
  console.log(users);
  users.subscribe(x => {
    if (x.length === 0) {
      this.afdb.object(`user/` + encodeURIComponent(email).replace('.', '%2E')).update({email: email, tagId: ''});
    } else {
      console.log('User exists!');
    }
  });
}
}
