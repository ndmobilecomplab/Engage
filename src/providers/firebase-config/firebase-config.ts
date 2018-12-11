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
      apiKey: "G_API_KEY",
      authDomain: "G_AUTH_DOMAIN",
      databaseURL: "G_DATABASE_URL",
      projectId: "G_PROJECT_ID",
      storageBucket: "G_PROJECT_ID.appspot.com",
      messagingSenderId: "G_MESSAGING_SENDER_ID"
      //END FB CRED
      // TODO: Replace with your project's customized code snippet
    };
    firebase.initializeApp(config);
  }
  
}
