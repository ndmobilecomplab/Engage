import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FirebaseConfigProvider } from '../firebase-config/firebase-config';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';

/*
Generated class for the FirebaseAuthProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class FirebaseAuthProvider {
  private _user: Subject<firebase.User> = null;
  
  constructor(firebaseConfig: FirebaseConfigProvider) {
    firebaseConfig.init();
  }
  
  get user(): Observable<firebase.User> {
    if(this._user == null){
      this._user = new Subject();
      this._user.next(firebase.auth().currentUser);
      firebase.auth().onAuthStateChanged((user) => {
        this._user.next(user);
      });
    }
    return this._user;
  }
  
  signInAnonymously(): Observable<Boolean> {
    let success: Subject<Boolean> = new Subject();
    firebase.auth().signInAnonymously().catch((error) => {
      console.log(error);
      success.next(false);
      //TODO: handle errors
    }).then(() => {
      success.next(true);
    });
    return success.asObservable();
  }
  
  signInWithGoogle() {
    this.setSignedIn("google");
    
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }
  
  checkSignedIn() {
    //check cookies to see if expecting a response
    /*
    if(window.localStorage.getItem("AUTH") == "google"){
      firebase.auth().getRedirectResult().then((result) => {
        if(result != null)
        
        console.log(result);
        
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          //var token = result.credential.accessToken;
          // ...
        }
        // The signed-in user info.
        var user = result.user;
      }).catch((error) => {
        console.log("hello");
        console.error(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    } */
  }
  
  setSignedIn(method : string){
    window.localStorage.setItem("AUTH", method);
  }
  
  signInWithCreds(email: string, password: string): Observable<firebase.auth.UserCredential> {
    let observer: Subject<firebase.auth.UserCredential> = new Subject();
    firebase.auth().signInWithEmailAndPassword(email, password).then((result) =>{
      observer.next(result);
    }).catch((error) => {
      observer.error(FirebaseAuthProvider.convertErrorCode(error));
    });
    return observer.asObservable();
  }
  
  newAccount(email: string, password: string): Observable<firebase.auth.UserCredential> {
    let observer: Subject<firebase.auth.UserCredential> = new Subject();
    firebase.auth().createUserWithEmailAndPassword(email, password).then((result) =>{
      observer.next(result);
    }).catch((error) => {
      observer.error(FirebaseAuthProvider.convertErrorCode(error));
    });
    return observer.asObservable();
  }
  
  private static convertErrorCode(error: any){
    switch(error.errorCode){
      case 'auth/user-not-found':
       return 'This user does not exist';
      case 'auth/invalid-email':
        return 'Not a valid email address';
      case 'auth/user-disabled':
        return 'Your account is currently disabled';
      case 'auth/wrong-password':
        return 'Wrong password for this account';
      default:
       return 'Could not complete that action';
    }
  }
  
  signOut(){
    firebase.auth().signOut();
  }
}
