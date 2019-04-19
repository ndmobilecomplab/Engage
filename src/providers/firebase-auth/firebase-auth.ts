import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FirebaseConfigProvider } from '../firebase-config/firebase-config';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';

/**
 * Provider handling user logic through Firebase
 */
@Injectable()
export class FirebaseAuthProvider {
  /**
   * A subject that subscribes to updates to the user
   */
  private _user: Subject<firebase.User> = null;

  constructor(firebaseConfig: FirebaseConfigProvider) {
    firebaseConfig.init();
  }

  /**
   * Gets the private _user, initializing it if needed
   */
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

  /**
   * Signs the user in anonymously
   * @returns Whether the result was successful
   */
  signInAnonymously(): Observable<Boolean> {
    //TODO consider whether using a subject is needed or whether just using a promise is fine
    let success: Subject<Boolean> = new Subject();
    firebase.auth().signInAnonymously().catch((error) => {
      success.next(false);
      success.complete();
      //TODO: handle errors
    }).then(() => {
      success.next(true);
      success.complete();
    });
    return success.asObservable();
  }

  /**
   * Signs the user in with Google - redirecting the user
   */
  signInWithGoogle(): void {
    this.setSignedIn("google");

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  /**
   * @deprecated
   */
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

  /**
   * Sets a session variable to save how the user had signed in
   * @param method how the user signed in
   */
  setSignedIn(method : string){
    window.localStorage.setItem("AUTH", method);
  }

  /**
   * Signs the user in with the specified credentials
   * @param email the user's email
   * @param password the user's password
   */
  signInWithCreds(email: string, password: string): Observable<firebase.auth.UserCredential> {
    let observer: Subject<firebase.auth.UserCredential> = new Subject();
    firebase.auth().signInWithEmailAndPassword(email, password).then((result) =>{
      observer.next(result);
    }).catch((error) => {
      observer.error(FirebaseAuthProvider.convertErrorCode(error));
    });
    return observer.asObservable();
  }

  /**
   * Creates a new account for the user
   * @param email the user's email
   * @param password the user's password
   */
  newAccount(email: string, password: string): Observable<firebase.auth.UserCredential> {

    let observer: Subject<firebase.auth.UserCredential> = new Subject();
    // TODO also consider whether to use the subject
    firebase.auth().createUserWithEmailAndPassword(email, password).then((result) =>{
      observer.next(result);
      observer.complete();

      /* Add the user's data to the firebase */
      var database = firebase.database();
      //FIXME: Is this how you get the user ID?
      var userId = result;
      console.log(userId.user.uid);
      var key = 1;

        firebase.database().ref('/users/' + userId.user.uid + '/login-info').set({
            email: email,
            password: password
          }).catch((error) => {
            observer.error(FirebaseAuthProvider.convertErrorCode(error));
            console.log(error);
            console.log("PROBLEMS!");
          });
    }).catch((error) => {
      observer.error(FirebaseAuthProvider.convertErrorCode(error));
      console.log(error);
    });

    return observer.asObservable();
  }

  /**
   * Converts the error code into a nice, human-readable string
   * @param error the error code provide from Firebase
   */
  private static convertErrorCode(error: any): string{
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

  /**
   * Signs the user out
   */
  signOut(): void {
    firebase.auth().signOut();
  }
}
