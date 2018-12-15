import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

/**
 * Provider that needs to be injected and initialized as a dependency for providers using Firebase
 */
@Injectable()
export class FirebaseConfigProvider {

  /**
   * Prevents Firebase from being initialized multiple times
   */
  private isInit = false;
  
  constructor() {
  }
  
  /**
   * Sets up Firebase with the user's credentials
   */
  init(): void {
    if(this.isInit) return;
    this.isInit = true;
    const config = {
      //FB CRED
      apiKey: "AIzaSyBqbkrAUK0cttecGx-uRnUA-2jbYkl_S8A",
      authDomain: "engage-219920.firebaseapp.com",
      databaseURL: "https://engage-219920.firebaseio.com",
      projectId: "engage-219920",
      storageBucket: "engage-219920.appspot.com",
      messagingSenderId: "498276752871"
      //END FB CRED
      // TODO: Replace with your project's customized code snippet
    };
    firebase.initializeApp(config);
  }
  
}
