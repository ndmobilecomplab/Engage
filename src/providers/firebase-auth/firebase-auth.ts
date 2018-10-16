import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FirebaseConfigProvider } from '../firebase-config/firebase-config';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import firebase from 'firebase';

/*
Generated class for the FirebaseAuthProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class FirebaseAuthProvider {
  user: Subject<firebase.User> = null;
  public isSignedIn: boolean = false;
  
  constructor(firebaseConfig: FirebaseConfigProvider) {
    firebaseConfig.init();
  }
  
  getDisplayName(): Observable<string> {
    return this.getUser().pipe(map(u => u.displayName));
  }
  
  setDisplayName(name: string) {
    firebase.auth().currentUser.updateProfile({
      displayName: name,
      photoURL: null
    }).then(u => {
      this.user.next(firebase.auth().currentUser);
    });
  }
  
  signInAnonymously(): Observable<Boolean> {
    let success: Subject<Boolean> = new Subject();
    firebase.auth().signInAnonymously().catch((error) => {
      console.log(error);
      success.next(false);
      //TODO: handle errors
    }).then(() => {
      this.isSignedIn = true;
      success.next(true);
    });
    return success.asObservable();
  }
  
  getUser = (): Observable<firebase.User> => {
    if(this.user == null){
      this.user = new Subject();
      firebase.auth().onAuthStateChanged((changedUser) => {
        this.user.next(changedUser);
      });
      firebase.auth().signInAnonymously().catch((error) => {
        console.log(error);
        //TODO: handle errors
      });
    }
    return this.user.asObservable();
  }
  
}
